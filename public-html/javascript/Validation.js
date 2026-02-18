// some rudimentary javascript form field validation and supporting functions
function validatePositiveInteger(input) {
  // First check for leading 0s, then make sure that there are only numbers in the field
  // Then set the value to the replaced value so that it is impossible to type nonsense in the number field
  let value = input.value;
  // Remove leading zeros
  value = value.replace(/^0+/, "") || "";
  // Ensure only digits remain
  value = value.replace(/\D/g, "");
  input.value = value;
}

// check the incoming string if it is IPv4, then return 'IPv4'
// if it is IPv6, then return 'IPv6'
// if it is neither, then return false
function is4or6(ip) {
  if (validIP(ip)) {
    // Will need to use regex to check if it is an IPv4 address or IPv6 address
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipv4Regex.test(ip)) {
      // we already checked if it was a valid IP, so we can just use the easier regex here
      // and find out that it is an IPv4 address, and if not, assume it is iPv6
      return('IPv4');
    } else {
      return('IPv6');
    }
  } else {
    // it was not an IP at all
    return(false);
  }
}

// Function to determine if an IPv4 address is actually a valid IPv4 address
// it seems that the only way to do this in JavaScript is with a regular expression
// and coupling methods

function validIP(ip) {
  let result=false;
  // does the ip match IPv4 pattern
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (ipv4Regex.test(ip)) {
    //it was an IPv4;
    // is each octet 0 - 255?
    const parts = ip.split('.');
    let stumble=false
    for (const part of parts) {
      if (parseInt(part) > 255 || parseInt(part) < 0) {
        stumble=true;
      }
    }
    if (!stumble) {
      // ipv4 found
      result=true;
    }
  } else {
    // is it ipv6?
    const ip6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/; // from https://ihateregex.io/expr/ipv6/
    if (ip6Regex.test(ip)) {
      //ip6 found
      result=true;
    }
  }
  return(result);
}

function ErrorMessage(id,message) {
  // id = the id of the element to which we will apply a red border
  //      if a value of false is sent, then we will not add a red border
  // message = the message to show in the ErrorMessageDiv innerHTML

  // set the red border to the element if applicable
  let origBorderStyle = {};
  if (id) {
//    console.log(id+' '+message);
    origBorderStyle = document.getElementById(id).style.border;
    document.getElementById(id).style.border = '1px solid red';
    // After 15 seconds, remove the red border
    setTimeout(() => {
      document.getElementById(id).style.border = origBorderStyle;
    }, 15000);
  }
  // add the message to the ErrorMessageDiv innerHTML
  if (message) {
    message = 'ERROR<br><br>'+message;
    document.getElementById('ErrorMessageDiv').innerHTML = message;
    showRelnotes('ErrorMessageDiv','ErrorMessageDivClose');
  }
}

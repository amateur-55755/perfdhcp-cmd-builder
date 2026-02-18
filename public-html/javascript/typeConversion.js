// a set of functions for converting various types of values to hex
// these will likely be specific to this application but could be
// adapted for something else

function getHexBytes(data,type) {
  // Sort out which of these to run based on the data and type submitted
  let hexBytes = '';
  // possible types: ip4 ip6 int32 uint32 uint16 uint8 fqdn string boolean binary
  if (type == 'ip4') {
    hexBytes = ip4ToHex(data);
  } else if (type == 'ip6') {
    hexBytes = ip6ToHex(data);
  } else if (type == 'int32' || type == 'uint32' ||type == 'uint16' ||type == 'uint8') {
    hexBytes = decToHex(data,type);
  } else if (type == 'fqdn') {
    hexBytes = fqdnToHex(data);
  } else if (type == 'string') {
    hexBytes = stringToHex(data);
  } else if (type == 'boolean') {
    hexBytes = booleanToHex(data);
  } else if (type == 'binary') {
    hexBytes = binToHex(data);
  } else if (type == 'hexidecimal') {
    hexBytes = HexToHex(data);
  } else {
    ErrorMessage(false,'Unknown data type chosen');
    return(false);
  }
  if (!hexBytes) {
    ErrorMessage(false,'Conversion of hex with data: "'+data+'" of specified type: "'+type+'" failed');
    return(false);
  }
  return(hexBytes);
}

function ip4ToHex(ip) {
  if (is4or6(ip) == 'IPv4') {
    // split on the '.'
    const octets = ip.split('.');
    let hex = '';
    for (let i = 0; i < octets.length; i++) {
      // send each number to decToHex(d,uint8)
      // build the hex with concatonation
      hex += decToHex(octets[i],'uint8');
    }
    // return full value which will be a 32 bit number in network byte order
    return(hex);
  } else {
    return(false);
  }
}

function ip6ToHex(ip) {
  if (is4or6(ip) == 'IPv6') {
    // something like this: fd00::3
    // to this: fd00:0000:0000:0000:0000:0000:0000:0003
    // ultimately to this: fd000000000000000000000000000003
    let hex = '';
    const parts = ip.split(':');
    let L = parts.length; // how many parts did we get?
    let E = 8 - L; // if < 8 then there is truncation that needs expanding
    for (let i = 0; i < L; i++) {
      // iterate the parts
      if (parts[i] != '') {
        // non-truncated, pad with 0s and add to the hex
        let S = parts[i];
        S = S.padStart(4, '0');
        hex += S;
      } else if (parts[i] == '') {
        // truncation, expand to the perceived length of the truncation with 16 bits of 0's
        for (let x = 0; x <= E; x++) {
          hex += '0000';
        }
      }
    }
    // and return
    return (hex);
  } else {
    return(false);
  }
}

function booleanToHex(x) {
  // it should be either a 0 or a 1 but we won't validate input
  let lx = x.toLowerCase();
  let hex = '00';
  if (lx == '0' || lx == 'false') {
    // it is false
  } else {
    // assume true
    hex = '01';
  }
  return(hex);
}

// convert decimal to hex
function decToHex(d,type) {
  // d = decimal to convert
  // type has possible values (uint8,uint16,uint32,int32)
  // as that is all that is needed
  // convert incoming string to integer
  let int = parseInt(d);
  if (Number.isNaN(int)) {
    return(false);
  }
  // need a number for padding
  let n=0;
  if (type == 'uint8') {
    n = 2;
  } else if (type == 'uint16') {
    n = 4;
  } else if (type == 'uint32') {
    n = 8;
  } else if (type == 'int32') {
    n = 8;
    if (int < 0) {
      // the integer was signed negative we need to shift bits for twos complement
      int = int >>> 0;
    }
  }
  // convert incoming int to hex and left pad as required
  let hex = int.toString(16).padStart(n, '0');
  // return resulting hex
  return(hex);
}

function binToHex(bin) {
  // content should be just 0's and 1's but we won't validate
  // first convert incoming "binary" to a base 2 integer
  let b2n = parseInt(bin, 2);
  //if (b2n == NaN) {
  if (Number.isNaN(b2n)) {
    return(false);
  }
  // now convert this base 2 integer to hex
  let hex = b2n.toString(16);
  // add 0?
  let l = hex.length;
  if (l % 2 !== 0) {
    hex = '0'+hex;
  }
  // now return
  return(hex);
}

function stringToHex(str) {
  // create UTF-8 encoder
  const encoder = new TextEncoder();
  // Create array of uint8 bytes from string
  const bytes = encoder.encode(str);
  // get length of the array
  let l = bytes.length;
  // create hex var
  let hex = '';
  // enter for loop
  for (let i = 0; i < l; i++) {
    // get current next byte number
    let n = bytes[i];
    // convert byte number to hex
    let h = n.toString(16);
    // pad hex if necessary
    if (h.length < 2) {
      h = '0'+h;
    }
    // concat hex to the hex string
    hex+=h;
  }
  // exit for loop
  // return completed hex string
  return(hex);
}

function fqdnToHex(fqdn) {
  let hex = '';
  // receive longlabelname.example.org, encode as RFC1035 section 3.1
  // no validation.  String should be opaque and administrator should know what is valid.
  // split on '.'
  const labels = fqdn.split('.');
  // iterate resultant array working on the current label only if it isn't empty
  // this prevents .this.domain..name. from causing problems and validation is not necessary
  let iterations = labels.length;
  for (let i = 0; i < iterations; i++) {
    let str = labels[i];
    if (str == '') {
      // do nothing if the current label only if it is empty
      // this prevents .this.domain..name. from causing problems and validation is not necessary
      // though it will encode .this.domain..name. as if you sent the correct thing :)
      // which might be confusing.
    } else {
      // get length of current label - encode to hex using decToHex(length,'uint8')
      let L = str.length;
      hex += decToHex(L,'uint8');
      // get string encoding of label with stringToHex(str)
      hex += stringToHex(str);
    }
  }
  // add the root
  hex += '00';
  // return hex variable
  return(hex);
}

function HexToHex(hex) {
  // strip leading 0x
  hex = hex.replace(/0x/g,'');
  // strip .
  hex = hex.replace(/\./g,'');
  // strip :
  hex = hex.replace(/\:/g,'');
  // strip -
  hex = hex.replace(/\-/g,'');
  // strip whitespace
  hex = hex.replace(/\s/g,'');
  // convert to lower case
  hex = hex.toLowerCase();
  // confirm that it is only 0-9a-f
  const regex = new RegExp("^[0-9a-f]+$",'g');
  if (hex.search(regex) == -1) {
    return(false);
  }
  // confirm that it is evently divisible by two
  if (hex.length % 2 !== 0) {
    return(false);
  }
  // return properly formatted hex string
  return(hex);
}


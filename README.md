# perfdhcp-cmd-builder

A javascript self-contained (open file in browser) GUI front end to create a perfdhcp command line.
It understands various kinds of encodings to avoid the need to hand create hex when testing with perfdhcp.

**Installation**: clone this repo

**Usage**: In your favorite web browser, open the file "index.html" from the cloned repo.

**Usage Instructions**: 

This is a simple javascript based web UI for creating a perfdhcp command line. The real purpose here is to make it easier to create the option content.
It is somewhat difficult to create this content for use in the perfdhcp tool because you have to create the hex yourself.
This software will accept various string content with a specification of what type of content it is.
When 'Get CMD' is pressed, a valid command line will appear in the gray box at the bottom of the screen.
Note that very little validation is performed, so garbage in, garbage out.
Though the command should not cause complaint from `perfdhcp`, it is possible to create content that won't work with the DHCP server.

_**Tips:**_

* It is required to choose DHCPv4 or DHcPv6
* It is recommended to at least chose a rate or packets will be flung with reckless abandon
* The outage simulation flags (-Y and -y) are meant to provide a simulation of clients that have not received an answer in some seconds which is probably only useful in the case that you are trying to test an HA relationship and need to simulate unacked clients.
* the DHCP6 flag `-A 1` simulates a number of hops that relayed the DHCPv6 traffic (currently, perfdhcp only supports one hop)
* The fun part is here (`-o` option)! Click "Add -o option", "Add -o 82,... option", or "Add --or Relay6 option" to add an option of each type.
* This is where the magic is. Add the option id in the first small field. If the chosen option does not consist of multiple parts, then just choose the type and add the string.
* If multiple parts are required (e.g., DHCPv4 option 81 (see: RFC 4702) which has several parts), click the "Add Part" button to add another part, choose the type and enter the string. Clicking the "Get CMD" button will cause these to be converted to hex using their respective types. They will be concatonated together into a single option. This is a real time-saver for those of us who need to use this command a lot. You still need to understand the content of the option, but you are saved from converting it yourself. 
* Option 82 (-o 82) sub-option id will be taken from the id entered in the first field.
* DHCP6 Relay Options (--or) will always be added at relay encapsulation level 1. If -A 1 isn't checked, it is inferred from the presence of this option. The option code will be taken from the code field.
* For a flags field, these are usually a single octet (8 bits). Choose the type "binary" and then place the bits as they should be (e.g., option 81 Flags field of |MBZ|N|E|O|S| where you might want to send a "1" in the "E" field would be 00000100 in the text input field with "binary" chosen for the type).
* Option example: An example of adding a multi-part option would be the aforementioned option 81. This option consists of multiple parts: |Flags|RCODE1|RCODE2||Domain name| Let us assume that you are wanting to send an RFC 1035 encoded domain name in option 81 so you need to set the "E" bit. This was mentioned above, of course. Steps: Click "Add -o Option". Enter 81 in the code field. Enter "00000100" in the data field. Choose "binary" for the type. This completes the Flags part. Click "Add Part". Enter "0" and choose "unit8" for the type which completes RCODE1. Click "Add Part". Enter "0" and choose "unit8" for the type which completes RCODE2. Click "Add Part". Enter the domain name (e.g., "www.example.org") and choose "fqdn" for the type. That is it! If you had, instead, wanted to send the string style domain name, you would have entered all 0's for the Flags, and chosen "string" for the type on the actual domain name.

![Screenshot](/interface.png)

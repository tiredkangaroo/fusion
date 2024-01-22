# bugs

lots of bugs in this one to get through

## bug 1: two messages sent by two seperate clients

steps to reproduce: have two clients on the same websocket connection and have them send text at the same time exactly, one client will end up sending an empty string no matter what they actually sent

i have only tested with emojis

## bug 2: moving conversation persists websocket

steps to reproduce: talk with one conversation using websockets, then lets have client 1 from that conversation move to another conversation, although they should now be connected to a new conversation, if anyone from the old conversation sends a message to it, it changes the conversation view to the old conversation while still showing as if it was displaying the new one

## bug 3: delete button

if the text wraps, the delete button is off, and you have to use x scroll looking towards the right to see the delete button for that message

## bug 4: validations are not in the frontend, and arent fully in the backend

title explains itself

## bug 5: the text underneath the message field can be inaccurate

usually its correct, but sometimes it says im using the normal http protocol, and not the upgraded websockets, even though i am using websockets??

it does not however says that im connected to websockets while being connected to normal http protocol

### these some weird little bugs

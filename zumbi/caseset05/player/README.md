# Player

## Local server
The player currently runs with a local server. The following description `partially` describes its storage format.

### Storage prefix
```
casenote_
```

### User profile
Key:
```
<storage prefix> profile- <user id>
```
JSON:
```
{
   id   : <user id>,
   name : <name>,
   age  : <age>,
   cases  : [<unique ids of the cases played by this user>]
}
```

### Track of a case execution by a user
Key:
```
<storage prefix> <current user> # <case id> # <date-time> - <guid>
```
JSON:
```
{
   userid : <user>,
   caseid : <case>,
   start  : <date and time of start>,
   inputs : {<inputs of the user>},
   route : [<rout of the user in the case>]
}
```

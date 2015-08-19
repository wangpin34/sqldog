# sqldog
Keep aware of the sql file is executed or not.

When develop project which depends on databases at your local machine, sometimes there are sqlfiles come from others or version control system like git and svn. Sqldog could help to manage this sql files. It can remember whether the file is executed or not. And it's convenient to use sqldog for executing sql files you want.  

### Install
[sqldog](https://www.npmjs.com/package/sqldog) is registered at npm but current it's available. Will be active if couple of days.

### General commands
* sqldog init
  Initialize current dir as a sql dog watched dir
* sqldog exec sql_file_name
  Execute a sql file. If this file was executed by sqldog previously, this action will be rejected ad you will get a message.
* sqldog exec -f sql_file_name
  Of course , you can execute a sql file althouth it was executed.
* sqldog status
  Get the status of the current sqldog dir.


### License
MIT

# sqldog

When develop project which depends on databases at your local machine, sometimes there are sqlfiles come from others or version control system like git and svn. Sqldog could help to manage this sql files. It can remember whether the file is executed or not. And it's convenient to use sqldog for executing sql files you want.  

Current it's only support Mysql. And it depends on [mysql command line](http://dev.mysql.com/doc/refman/5.6/en/mysql.html).

### Install

```
npm install -g sqldog
```
Install sqldog globally so that it can be used on commandline anywhere.

### Usage
* Initialize current dir as a sql dog watched dir
```
sqldog init
```
* Config options
```
sqldog config
```
Currently, db options can be configed here by the command.
```
prompt: Database Host:  (localhost)
prompt: Database Port:  (3306)
prompt: Username:  (root)
prompt: Password:
```
  
* Execute a sql file. If this file was executed by sqldog previously, this action will be rejected ad you will get a message.
```
sqldog exec sql_file_name
```
  
* Of course , you can execute a sql file althouth it was executed.
```
sqldog exec -f sql_file_name
```
  
* Get the status of the current sqldog dir.
```
sqldog status
```
* Sqldog walks around here and there to detect not tracked files, and removed files
```
sqldog walk
```

### License
MIT

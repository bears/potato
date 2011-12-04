Potato
======

This is a *practice* project for manage tasks simple and funny.

This project intends to run on [Nginx](http://www.nginx.org/)
 + [PHP](http://www.php.net/) + [PostgreSQL](http://www.postgresql.org/),
so you'd better setup such an environment first.

* Create a `nginx.conf.*` file by reference examples inside `setup`,
  and include it in your main `nginx.conf`
 * Add *potato.bears.home* and *ajaj.potato.bears.home* into your `/etc/hosts`.
 * Map *potato.bears.home* to `public`.
 * Map *ajaj.potato.bears.home* to `script`.
* Create a database called *potato*,
  which can be accessed by user *potato* with password *plough*.
 * Or modify *DSN* written in `script/setting/database.php` to what you want.
 * SQL for structures and data are all in `schema`.

Enjoy!
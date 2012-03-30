Potato
======

This is a *practice* project, for:

 - summarizing my experiences from participated projects.
 - illustrating some core structures of a minimal web framework.


Installation
------------

This project intends to run on [Nginx][ngx] + [PHP][php] + [PostgreSQL][pg].

 - Add `setup/nginx.conf.part` to your `nginx.conf`.
   - Note: replace contents between < and > with your needs.
 - The database connection setting *(DSN)* can be found
   from `setting/dsn/postgres.php`.
 - SQL for structures and test data are all in `schema` folder.


Copyright
---------

Copyright (c) 2011  YANG Xiuting (Iceberg Young)


License
-------

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You can find a copy of the GNU General Public License
from <http://www.gnu.org/licenses/>.

![GPLv3 logo](http://gplv3.fsf.org/gplv3-127x51.png)


### Exception

Anything inside `library` folders is *NOT* a part of this software,
which so will *NOT* be covered by this copyright announcement.
It's __your__ duty to check the right of obtaining and using of it.



[ngx]: http://www.nginx.org/
[php]: http://www.php.net/
[pg]: http://www.postgresql.org/

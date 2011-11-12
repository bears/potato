Potato of Bears
===============

	This is a *practice* project for manage tasks simple and funny.

Copyright
---------

	Copyright (C) 2011  YANG Xiuting (Iceberg Young)

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.

Install
-------

	This project intends to run on **Nginx** + **PHP** + **PostgreSQL**,
	so you'd better setup such an environment first.

	* Add **potato.bears.home** and **ajaj.bears.home** into your `/etc/hosts`
	* Create a `nginx.conf.*` file by reference examples inside `setup`,
	  and include it in your main `nginx.conf`
	* Create a database called *potato*
	  which can be accessed by user *potato* with password *plough*
	  Use SQL files inside `schema` to fill the structure and data

# qlbuilder (VSCode extension )

A **companion** `VSCode` extension which is used with [qlbuilder](https://github.com/countnazgul/qlBuilder)

The extension provide capability to operate with Qlik Data Connections (data preview, insert generated load script etc.)

The extension rely on `qlbuilder` configuration files and will extend the `qlbuilder` capability in VSCode 

Current limitations:

* only QlikSense Desktop or (local) Qlik Core
* only folder connections
* supports `csv`, `tsv`, `xls`, `xlsx`, `qvd`, `qvx`, `xml` and `kml` files
* not published in `VSCode` marketplace. Once the planned enhancements are done it will be available for download through the marketplace

Planned enhancements (sorted by priority):

* QSE support (from authentication pont of view)
* more data connections (`oledb`, `odbc`) (ideally all default types)
* `json`, `fix`, `html` files
* core review and optimisation

Not planned:

* create/edit data connection (if there is )
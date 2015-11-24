Upgrade notes:

--------------------------
24 November 2015
--------------------------

There was an issue discovered with Oracle and the table name limitation of 30 characters. We have renamed the offending table.

To align these changes in MySQL, you must complete the following steps PRIOR TO REBOOTING TOMCAT with the Kaltura LTI code committed on or after 24 November 2015:

Run the script impl/src/main/resources/ddl/sql/mysql/kaltura_upgrade_20151124.sql

This will rename the offending table "KALTURA_SITE_COPY_BATCH_DETAILS" to "KALTURA_SITE_COPY_BATCH"

NOTE: If you fail to do so and have "auto.ddl = true" set in sakai.properties, you will have an orphaned table and data. You will need to move the data over to the new table and remove the old table manually. If you do not have "auto.ddl = true" set in sakai.properties, you will receive Hibernate and JDBC errors while using the tool.

You may ignore this if you have newly installed the tool after 24 November 2015
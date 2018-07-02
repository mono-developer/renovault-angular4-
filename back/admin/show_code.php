<?php

require('config.php');
include('header.php');

echo <<<EOL

<div id="editor" style="position: absolute; top: 100px; right: 50px; bottom: 50px; left: 50px;">
EOL;

// echo "<pre>";

        $users = <<< EOT
/**********************************************************************************/
/**********************************************************************************/
/* CREATE USERS                                                                   */
/**********************************************************************************/
/**********************************************************************************/

/* system tables (not editable by users) */
CREATE USER 'drome_system'@'%' IDENTIFIED BY 'pWyu2rbcIrGXQQ5TAyRC';
GRANT USAGE ON *.* TO 'drome_system'@'%';
CREATE DATABASE IF NOT EXISTS `drome_system`;
GRANT ALL PRIVILEGES ON `drome_system`.* TO 'drome_system'@'%';

/* holds data tables (editable by users) */
CREATE USER 'drome_data'@'%' IDENTIFIED BY 'dy0kONtjfYVaBlkRcmVc';
GRANT USAGE ON *.* TO 'drome_data'@'%';
CREATE DATABASE IF NOT EXISTS `drome_data`;
GRANT ALL PRIVILEGES ON `drome_data`.* TO 'drome_data'@'%';
GRANT ALL PRIVILEGES ON `drome_data`.* TO 'drome_system'@'%';

/* holds security views */
CREATE USER 'drome_user'@'%' IDENTIFIED BY '1SIrAkLGknklKZU61y6u';
GRANT USAGE ON *.* TO 'drome_user'@'%';
CREATE DATABASE IF NOT EXISTS `drome_user`;
GRANT ALL PRIVILEGES ON `drome_user`.* TO 'drome_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `drome_data`.* TO 'drome_user'@'%';
GRANT CREATE, DROP, INDEX, ALTER ON `drome_data`.* TO 'drome_user'@'%';
GRANT SELECT ON `drome_system`.* TO 'drome_user'@'%';

/* holds views and tables for reports */
CREATE USER 'drome_report'@'%' IDENTIFIED BY 'mpeP0OMWB7zBgeO2JOlY';
GRANT USAGE ON *.* TO 'drome_report'@'%';
CREATE DATABASE IF NOT EXISTS `drome_report`;
GRANT ALL PRIVILEGES ON `drome_report`.* TO 'drome_report'@'%';

GRANT SELECT ON `drome_user`.* TO 'drome_report'@'%';
GRANT SELECT ON `drome_report`.* TO 'drome_user'@'%';
GRANT SELECT ON `drome_report`.* TO 'drome_system'@'%';
GRANT SELECT ON `drome_user`.* TO 'drome_data'@'%';

GRANT EXECUTE ON `drome_user`.* TO 'drome_data'@'%';
GRANT EXECUTE ON `drome_user`.* TO 'drome_report'@'%';


/* bug database */
CREATE USER 'flyspray'@'%' IDENTIFIED BY 'CM0kvcQZAQcbGa9iKBbZ';
GRANT USAGE ON *.* TO 'flyspray'@'%';
CREATE DATABASE IF NOT EXISTS `flyspray` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON `flyspray`.* TO 'flyspray'@'%';


EOT;
        echo $users;



        $functions = <<< EOT





/**********************************************************************************/
/**********************************************************************************/
/* CREATE FUNCTIONS                                                               */
/**********************************************************************************/
/**********************************************************************************/
drop function if exists drome_user.securityid;
create function drome_user.securityid() returns int
begin
    return @securityid;
end;

drop function if exists drome_user.securitylogin;
create function drome_user.securitylogin() returns varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
begin
    return @securitylogin;
end;

drop function if exists drome_user.securityadminmode;
create function drome_user.securityadminmode() returns boolean
begin
    if @securityadminmode = 'Y' then
        return TRUE;
    else
        return FALSE;
    end if;
end;

drop procedure if exists drome_user.checksecurityid;
create procedure drome_user.checksecurityid(p_table varchar(191), p_record_securityid int, p_operation varchar(191))
begin
    if drome_user.securityid() is null or (p_record_securityid IS NOT NULL AND p_record_securityid <> drome_user.securityid()) then
        SET @message = CONCAT('Insufficient rights for ', ifnull(p_operation, '(null)'), ' on table ', ifnull(p_table,'(null)'), '.');
        signal sqlstate '45000' set message_text = @message; 
    end if;
end;

drop procedure if exists drome_user.checkgranteerole;
create procedure drome_user.checkgranteerole(p_table varchar(191), p_row_id int, p_operation varchar(191))
begin
    declare v_granteerole varchar(191);

    if p_table = 'object' then
        select granteerole into v_granteerole FROM drome_user.object WHERE id = p_row_id;
    end if;            

    if p_table = 'hoa' then
        select granteerole into v_granteerole FROM drome_user.hoa WHERE id = p_row_id;
    end if;            

    if p_table = 'hoamember' then
        select granteerole into v_granteerole FROM drome_user.hoamember WHERE id = p_row_id;
    end if;            

    if p_table = 'questioninstance' then
        select granteerole into v_granteerole FROM drome_user.questioninstance WHERE id = p_row_id;
    end if;            

    if v_granteerole is null or v_granteerole <> 'owner' then
        SET @message = CONCAT('Insufficient rights for ', ifnull(p_operation, '(null)'), ' on table ', ifnull(p_table,'(null)'), '.');
        signal sqlstate '45000' set message_text = @message;
    end if;
end;



EOT;
        echo $functions;



$indexes = <<< EOT





/**********************************************************************************/
/**********************************************************************************/
/* CREATE INDEXES                                                                 */
/**********************************************************************************/
/**********************************************************************************/

alter table drome_data.security drop index uk_security_1;
alter table drome_data.security add unique index uk_security_1 (referencetable, referenceid, granteelogin);



EOT;
        echo $indexes;



        $dropCols = <<< EOT




/**********************************************************************************/
/**********************************************************************************/
/* DROP COLUMNS                                                                   */
/**********************************************************************************/
/**********************************************************************************/

alter table drome_data.image drop column granteerole;
alter table drome_data.object drop column granteerole;
alter table drome_data.hoa drop column granteerole;
alter table drome_data.hoamember drop column granteerole;
alter table drome_data.party drop column granteerole;
alter table drome_data.partyaccount drop column granteerole;
alter table drome_data.questioninstance drop column granteerole;


EOT;
        echo $dropCols;

        $createViews = <<< EOT





/**********************************************************************************/
/**********************************************************************************/
/* CREATE VIEWS                                                                   */
/**********************************************************************************/
/**********************************************************************************/



/**********************************************************************************/
/* tables without security                                                        */
/**********************************************************************************/
create or replace definer = drome_user view drome_user.externaldatacache as select * from drome_data.externaldatacache;
create or replace definer = drome_user view drome_user.sessions as select * from drome_data.sessions;



/**********************************************************************************/
/* tables protected by securityid, current user can see and edit own contents     */
/**********************************************************************************/

create or replace definer = drome_user view drome_user.party as 
select * from drome_data.party where securityid = drome_user.securityid()
;

create or replace definer = drome_user view drome_user.partyaccount as 
select id,login,multipleobjects,securityid,party_id,settings from drome_data.partyaccount where securityid = drome_user.securityid()
;

create or replace definer = drome_user view drome_user.email as 
select * from drome_data.email where securityid = drome_user.securityid()
;

create or replace definer = drome_user view drome_user.security as 
select security.* from drome_data.security where securityid = drome_user.securityid()
;





/**********************************************************************************/
/* securitygranted, the view that defines the grants that the current user has    */
/**********************************************************************************/

create or replace definer = drome_user view drome_user.securitygranted as 
select 
    security.*
from 
    drome_data.security 
where 
    granteelogin = drome_user.securitylogin()
;




/**********************************************************************************/
/* tables protected by securitygranted, they all have a column called granteerole */
/**********************************************************************************/

create or replace definer = drome_user view drome_user.object as 
select 
    object.*,
    securitygranted.granteerole granteerole
from 
    drome_data.object
    inner join drome_user.securitygranted on securitygranted.referencetable = 'object' and securitygranted.referenceid = object.id
;

create or replace definer = drome_user view drome_user.hoa as 
select 
    hoa.*,
    securitygranted.granteerole granteerole
from 
    drome_data.hoa
    inner join drome_user.securitygranted on securitygranted.referencetable = 'hoa' and securitygranted.referenceid = hoa.id
;

create or replace definer = drome_user view drome_user.hoamember as 
select 
    hoamember.*,
    hoa.granteerole granteerole
from 
    drome_data.hoamember
    inner join drome_user.hoa on hoamember.hoaid = hoa.id
;

create or replace definer = drome_user view drome_user.questioninstance as 
select 
    questioninstance.*,
    object.granteerole granteerole
from 
    drome_data.questioninstance
    inner join drome_user.object on questioninstance.reference_table = 'object' and questioninstance.reference_id = object.id
union all
select 
    questioninstance.*,
    hoa.granteerole granteerole
from 
    drome_data.questioninstance
    inner join drome_user.hoa on questioninstance.reference_table = 'hoa' and questioninstance.reference_id = hoa.id
;

create or replace definer = drome_user view drome_user.image as 
select 
    image.*,
    object.granteerole granteerole
from 
    drome_data.image
    inner join drome_user.object on image.reference_table = 'object' and image.reference_id = object.id
union all
select 
    image.*,
    hoa.granteerole granteerole
from 
    drome_data.image
    inner join drome_user.hoa on image.reference_table = 'hoa' and image.reference_id = hoa.id
union all
select 
    image.*,
    questioninstance.granteerole granteerole
from 
    drome_data.image
    inner join drome_user.questioninstance on image.reference_table = 'questioninstance' and image.reference_id = questioninstance.id
;       




/**********************************************************************************/
/* frontend views on backend objects (read-only)                                  */
/**********************************************************************************/
create or replace definer = drome_user view drome_user.contentitem as select * from drome_system.contentitem;
create or replace definer = drome_user view drome_user.questions as select * from drome_system.questions;
create or replace definer = drome_user view drome_user.questiontree as select * from drome_system.questiontree;
create or replace definer = drome_user view drome_user.report as select * from drome_system.report;
create or replace definer = drome_user view drome_user.settings as select * from drome_system.settings;
create or replace definer = drome_user view drome_user.site as select * from drome_system.site;







/**********************************************************************************/
/* backend views, drome_system can see drome_data tables in backend               */
/**********************************************************************************/
create or replace definer = drome_system view drome_system.email as select * from drome_data.email
;
create or replace definer = drome_system view drome_system.partyaccount as select * from drome_data.partyaccount
;


EOT;

        echo $createViews;
        
        echo <<<EOL





/**********************************************************************************/
/**********************************************************************************/
/* CREATE TRIGGERS                                                                */
/**********************************************************************************/
/**********************************************************************************/
EOL;

        // tables owned by user only
        $tables = [ 'party', 'partyaccount', 'email'];

        foreach($tables as $table)
        {
            $p = <<<EOT


/* ${table} */

drop trigger drome_data.${table}_before_insert;

create trigger drome_data.${table}_before_insert before insert on drome_data.${table} for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checksecurityid('${table}', new.securityid, 'insert');
        set new.securityid = drome_user.securityid();
    end if;
end;

drop trigger drome_data.${table}_before_update;

create trigger drome_data.${table}_before_update before update on drome_data.${table} for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checksecurityid('${table}', new.securityid, 'update');
        set new.securityid = old.securityid;
    end if;
end;

drop trigger drome_data.${table}_before_delete;

create trigger drome_data.${table}_before_delete before delete on drome_data.${table} for each row 
begin
    if not drome_user.securityadminmode() then
        call drome_user.checksecurityid('${table}', old.securityid, 'delete');
    end if;
end;           

EOT;
            echo $p;
        }


        // tables shared with others
        $tables = ['object', 'hoa'];

        foreach($tables as $table)
        {
            $p = <<<EOT

/* ${table} */

drop trigger drome_data.${table}_before_insert;

create trigger drome_data.${table}_before_insert before insert on drome_data.${table} for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checksecurityid('${table}', new.securityid, 'insert');
        set new.securityid = drome_user.securityid();
    end if;
end;

drop trigger drome_data.${table}_before_update;

create trigger drome_data.${table}_before_update before update on drome_data.${table} for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checkgranteerole('${table}', old.id, 'update');
        set new.securityid = old.securityid;
    end if;
end;

drop trigger drome_data.${table}_before_delete;

create trigger drome_data.${table}_before_delete before delete on drome_data.${table} for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checkgranteerole('${table}', old.id, 'delete');
    end if;
end; 
                
EOT;
        echo $p;

        }

        $hoamembertrigger = <<<EOT

/* hoamember */

drop trigger drome_data.hoamember_before_insert;

create trigger drome_data.hoamember_before_insert before insert on drome_data.hoamember for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checkgranteerole('hoa', new.hoaid, 'insert');
    end if;
end;

drop trigger drome_data.hoamember_before_update;

create trigger drome_data.hoamember_before_update before update on drome_data.hoamember for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checkgranteerole('hoa', old.hoaid, 'update');
        set new.hoaid = old.hoaid;
    end if;
end;

drop trigger drome_data.hoamember_before_delete;

create trigger drome_data.hoamember_before_delete before delete on drome_data.hoamember for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checkgranteerole('hoa', old.hoaid, 'delete');
        set new.hoaid = old.hoaid;
    end if;
end; 
                
EOT;
        echo $hoamembertrigger;

        // tables shared with others
        $tables = ['questioninstance', 'image'];

        foreach($tables as $table)
        {
            $p = <<<EOT

/* ${table} */

drop trigger drome_data.${table}_before_insert;

create trigger drome_data.${table}_before_insert before insert on drome_data.${table} for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checkgranteerole(new.reference_table, new.reference_id, 'insert');
    end if;
end;

drop trigger drome_data.${table}_before_update;

create trigger drome_data.${table}_before_update before update on drome_data.${table} for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checkgranteerole(old.reference_table, old.reference_id, 'update');
        set new.reference_table = old.reference_table;
        set new.reference_id = old.reference_id;
    end if;
end;

drop trigger drome_data.${table}_before_delete;

create trigger drome_data.${table}_before_delete before delete on drome_data.${table} for each row 
begin 
    if not drome_user.securityadminmode() then
        call drome_user.checkgranteerole(old.reference_table, old.reference_id, 'delete');
    end if;
end;           
            
EOT;
            echo $p;
        }


        $securitytrigger = <<<EOT

/* security */

drop trigger drome_data.security_before_insert;

create trigger drome_data.security_before_insert before insert on drome_data.security for each row 
begin 
    declare v_granteerole varchar(191);

    if not drome_user.securityadminmode() then
    
        /* check rights on parent */
        call drome_user.checkgranteerole(new.referencetable, new.referenceid, 'insert');

        /* check if no new owner is inserted */
        if new.granteerole = 'owner' then
            signal sqlstate '45000' set message_text = 'Insufficient rights to insert owner into security';
        end if;

        /* make sure new record is inserted by current user */
        set new.securityid = drome_user.securityid();
        set new.securitylogin = drome_user.securitylogin();

    end if;
end;

drop trigger drome_data.security_before_update;

create trigger drome_data.security_before_update before update on drome_data.security for each row 
begin 
declare v_granteerole varchar(191);

    if not drome_user.securityadminmode() then

        /* check rights on parent */
        call drome_user.checkgranteerole(old.referencetable, old.referenceid, 'update');
        call drome_user.checkgranteerole(new.referencetable, new.referenceid, 'update');

        /* check if no new owner is inserted */
        if new.granteerole = 'owner' then
            signal sqlstate '45000' set message_text = 'Insufficient rights to update security';
        end if;

        /* make sure new record is inserted by current user */
        set new.securityid = drome_user.securityid();
        set new.securitylogin = drome_user.securitylogin();
    
    end if;
end;

drop trigger drome_data.security_before_delete;

create trigger drome_data.security_before_delete before delete on drome_data.security for each row 
begin 
    declare v_granteerole varchar(191);

    if not drome_user.securityadminmode() then

        /* check rights on parent */
        call drome_user.checkgranteerole(old.referencetable, old.referenceid, 'delete');

        /* check if no new owner is inserted */
        if old.granteerole = 'owner' and not drome_user.securityadminmode() then
            signal sqlstate '45000' set message_text = 'Insufficient rights to delete from security';
        end if;

    end if;
end;       
        
        

        
EOT;
        echo $securitytrigger;

        // echo "</pre>";


echo <<<EOL
        </div>

    <script src="js/ace-builds-master/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
    <script>
        var editor = ace.edit("editor");
        // editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/sql");
        editor.setShowPrintMargin(false);
        editor.setReadOnly(true);
    </script>
EOL;


include('footer.php');

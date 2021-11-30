
import sql from "mssql";

export default function importToDB(dbConfig, merged) {
    var tableName = 'dbo.Settings';
    var verifySettingsTableExist = "IF OBJECT_ID ('" + tableName + "')  IS NULL Create TABLE " + tableName + " ( id int IDENTITY(1,1), ConfigKey varchar (225),  ConfigValue varchar (225),PRIMARY KEY (id))";
    sql.connect(dbConfig).then(con => con.query(verifySettingsTableExist, function (err, recordset) {
        if (err) console.log(err)
        else insertIntoSettings(dbConfig, merged);
    }));
}
function insertIntoSettings(dbConfig, merged) {
    sql.connect(dbConfig).then(() => {
        const table = new sql.Table('dbo.Settings');
        table.create = true;
        table.columns.add('ConfigKey', sql.VarChar(225));
        table.columns.add('ConfigValue', sql.VarChar(225));

        Object.keys(merged).forEach(key =>
            table.rows.add(key.toString(),JSON.stringify(merged[key]) )
        );

        const request = new sql.Request();
        return request.bulk(table)
    });
}
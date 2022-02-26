const { connect } = require("../db/db.config.js");
const { currentDateTime } = require("../utils/date.js");

const User = {};

User.getAllUsers = async () => {
    const result = await connect.query(
        "select id, name, email, createdDate from user"
    );
    return result;
};

User.getUserById = async (id) => {
    const result = await connect.query(
        "select id, name, email, createdDate from user where id=?",
        [id]
    );
    return result;
};

User.getUserByEmail = async (email) => {
    const result = await connect.query("select * from user where email=?", [email]);
    return result;
};

User.insertUser = async (body) => {

    const {  ...restBody } = body;

    const keys = Object.keys(restBody);

    let queryString = "";
    const valueArray = [];

    keys.forEach((key) => {
        queryString += `${key}=?,`;
        valueArray.push(restBody[key]);
    });

   let varify =0;

    const result = await connect.query(
        `insert into user set  ${queryString} createdDate=?, verify=? `,
        [
            ...valueArray,
            currentDateTime(),
            varify
        ]
    );

    return result;
};

User.deleteUserById = async (id) => {
    const result = await connect.query("delete from user where id=?", [id]);
    return result;
};

User.updateUserById = async (body) => {
    const { id, ...restBody } = body;

    delete restBody.password;
    delete restBody.email;

    const keys = Object.keys(restBody);

    let queryString = "";
    const valueArray = [];

    keys.forEach((key) => {
        queryString += `${key}=?,`;
        valueArray.push(restBody[key]);
    });

    const result = await connect.query(`update user set ${queryString} updatedDate=? where id=?`, [
        ...valueArray,
        currentDateTime(),
        id,
    ]);

    return result;
};


User.verifyUser = async (body) => {
    const { id} = body;

    let varify =1;

    const result = await connect.query(`update user set updatedDate=?, verify=? where id=?`, [
        currentDateTime(),
        varify,
        id,
    ]);

    return result;
};


User.updateUserPassword = async (body) => {
    const { id, ...restBody } = body;

    delete restBody.email;
    delete restBody.name;
    delete restBody.createdDate;
    delete restBody.verify;

    const keys = Object.keys(restBody);

    let queryString = "";
    const valueArray = [];

    keys.forEach((key) => {
        queryString += `${key}=?,`;
        valueArray.push(restBody[key]);
    });

    const result = await connect.query(`update user set ${queryString} updatedDate=? where id=?`, [
        ...valueArray,
        currentDateTime(),
        id,
    ]);

    return result;
};


module.exports = User;

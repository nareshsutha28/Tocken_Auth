// models/userModel.js
const { pool } = require('./db_connection');


const users = [];



class UserModel {
  static async getAllUsers() {
    const query = 'SELECT * FROM public."User"';
    const result = await pool.query(query);
    const rows = result.rows;
    return rows;
  }
  
  static async addUser(user) {
    console.log("user",user);
    const query = 'INSERT INTO public."User" (username, password, email) VALUES ($1, $2, $3);';
    await pool.query(query, [ user.username, user.password, user.email ]);
  }

  
  static async deleteUser(email) {

    const query = 'DELETE FROM public."User" WHERE email=$1';
    await pool.query(query,[email,]);
  }

  static async loginUser(user) {
    console.log("user",user);
    const query = 'SELECT * FROM public."User" WHERE email=$1';
    const user_data = await pool.query(query,[user.email,]);
    const result = user_data.rows[0]
    return result
  }
  
 
// Create a JWT token with no expiration time (exp claim is omitted)
static async checkForValidToken(data) {
  try{
    const query = 'SELECT * FROM public."Blacklisted_token" WHERE token=$1';
    const result = await pool.query(query, [data]);
    const rows = result.rows;
    if (rows.length > 0){
      return false 
    } else { 
      return true
    }
  }
  catch(err){
   console.log("error", err);
 }
 }

// Create a JWT token with no expiration time (exp claim is omitted)
static async addIntoBlackList(data) {
  try{
    const query = 'INSERT into public."Blacklisted_token" (token) values ($1) ON CONFLICT (token) DO NOTHING;';
    const result = await pool.query(query, [data]);
    
    if (result){ 
      return true
    }
  }
  catch(err){
   console.log("error", err);
 }
 }

}



module.exports = UserModel;
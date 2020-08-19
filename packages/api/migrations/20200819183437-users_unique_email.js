module.exports = {
  async up(db) {
    await db.collection("users").createIndex("email", { unique: true });
  },

  async down(db) {
    await db.collection("users").dropIndex("email_1");
  },
};

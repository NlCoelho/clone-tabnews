exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    //For reference, GitHub limits usernames to 39 characteres.
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    //For reference, StackOverFlow.
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // Why 60 in length? https://npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;

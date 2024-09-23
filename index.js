const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.db",
});

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  },
);

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Tablo oluşturuldu.\n");

    const user1 = await User.create({ name: "Alice", age: 25 });
    const user2 = await User.create({ name: "Bob", age: 30 });
    console.log("Veri eklendi: Alice ve Bob.\n");

    let users = await User.findAll();
    console.log("Tüm kullanıcılar (ilk listeleme):");
    users.forEach((user) =>
      console.log(`Name: ${user.name}, Age: ${user.age}`),
    );
    console.log("\n");

    await User.update({ age: 26 }, { where: { name: "Alice" } });
    console.log("Alice'in yaşı güncellendi.\n");

    users = await User.findAll();
    console.log("Tüm kullanıcılar (güncellenmiş listeleme):");
    users.forEach((user) =>
      console.log(`Name: ${user.name}, Age: ${user.age}`),
    );
    console.log("\n");

    await user1.destroy();
    console.log("Alice soft delete ile silindi.\n");

    users = await User.findAll();
    console.log("Tüm kullanıcılar (Alice silindikten sonra):");
    users.forEach((user) =>
      console.log(`Name: ${user.name}, Age: ${user.age}`),
    );
    console.log("\n");

    const deletedUsers = await User.findAll({ paranoid: false });
    console.log("Silinmiş kullanıcılar dahil tüm kullanıcılar:");
    deletedUsers.forEach((user) =>
      console.log(
        `Name: ${user.name}, Age: ${user.age}, DeletedAt: ${user.deletedAt}`,
      ),
    );
    console.log("\n");
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  } finally {
    await sequelize.close();
    console.log("Bağlantı kapatıldı.");
  }
})();

import { Sequelize, DataTypes } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import * as dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: process.env.POSTGRESQL_DATABASE,
  user: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  host: process.env.POSTGRESQL_HOST,
  port: process.env.POSTGRESQL_PORT,
  ssl: false,
  clientMinMessages: "notice",
});

const Blog = sequelize.define(
  "Blog",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

(async () => {
  try {
    await sequelize.sync({ force: true });

    const post1 = await Blog.create({ title: "Foo", content: "Test 1" });
    const post2 = await Blog.create({ title: "Bar", content: "Test 2" });

    let posts = await Blog.findAll();
    posts.forEach((post) =>
      console.log(`Title: ${post.title}, Content: ${post.content}`)
    );
    console.log("\n");

    await Blog.update({ content: "Test" }, { where: { title: "Foo" } });

    posts = await Blog.findAll();
    posts.forEach((post) =>
      console.log(`Title: ${post.title}, Content: ${post.content}`)
    );
    console.log("\n");

    await post1.destroy();

    posts = await Blog.findAll();
    posts.forEach((post) =>
      console.log(`Title: ${post.title}, Content: ${post.content}`)
    );
    console.log("\n");

    const deletedBlogs = await Blog.findAll({ paranoid: false });
    deletedBlogs.forEach((post) =>
      console.log(
        `Title: ${post.title}, Content: ${post.content}, DeletedAt: ${post.deletedAt}`
      )
    );
    console.log("\n");
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  } finally {
    await sequelize.close();
    console.log("Bağlantı kapatıldı.");
  }
})();

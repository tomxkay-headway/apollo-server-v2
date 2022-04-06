const generateRandomString = require("../utils/generateRandomString");

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => "Hello world!",
    async link(root, { id }, { models }) {
      return models.Link.findByPk(id);
    },
    async allLinks(root, args, { models }) {
      return models.Link.findAll({
        order: [["createdAt", "DESC"]]
      });
    }
  },
  Mutation: {
    async createLink(root, { url, slug }, { models }) {
      let slugToUse = slug || generateRandomString();

      const findLinkWithSlug = (slug) => {
        return models.Link.findOne({ where: { slug } });
      };

      let linkFound = await findLinkWithSlug(slugToUse);

      // make sure slug is unique
      while (linkFound) {
        slugToUse = generateRandomString();
        linkFound = await findLinkWithSlug(slugToUse);
      }

      return models.Link.create({
        url,
        slug: slugToUse
      });
    }
  }
};

module.exports = resolvers;

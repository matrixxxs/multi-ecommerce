export const completedOrderFilter = {
  status: {
    notIn: ["pending", "cancelled"],
  },
};

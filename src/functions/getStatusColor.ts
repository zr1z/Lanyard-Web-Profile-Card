export const getStatusColor = (status: string) => {
  return statusColors[status as keyof typeof statusColors] || statusColors.offline;
};

export const statusText = {
  online: "Online",
  offline: "Offline",
  idle: "Idle",
  dnd: "Do Not Disturb",
};

export const statusColors = {
  online: "#57F287",
  offline: "#808080",
  idle: "#F0B232",
  dnd: "#ED4245",
};

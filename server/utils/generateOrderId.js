const generateOrderId = () => {
  const prefix = "OD";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(100000 + Math.random() * 900000);
  
  return `${prefix}${timestamp}${random}`;
};

export default generateOrderId;


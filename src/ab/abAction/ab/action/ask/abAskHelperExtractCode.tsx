const response = that.response;
const match = response.match(/```(?:\w*)\s*\n([\s\S]*?)```/);
return match ? match[1].trim() : response.trim();

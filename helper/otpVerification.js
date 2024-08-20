const verifyOtp = async (otpTime) => {
  try {
    console.log("MilliSecond is:", otpTime);

    const cDateTime = new Date();
    let differenceValue = (otpTime - cDateTime.getTime()) / 1000;
    differenceValue /= 60;

    const minutes = Math.abs(differenceValue);

    console.log("Expired Minutes:", minutes);

    if (minutes > 10) {
      return true;
    }

    return false;
  } catch (err) {
    console.log(err.message);
    return false; 
  }
};

export default verifyOtp;

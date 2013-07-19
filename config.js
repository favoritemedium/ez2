
// config

var config = module.exports = {
  companyHost: 'HOST-TO-CHANGE'
, sessionKey: 'KEY-TO-CHANGE'
};

if (process.env.NODE_ENV === 'production') {
  config.google = {
    id: 'ID-TO-CHANGE'
  , secret: 'SECRET-TO-CHANGE'
  };;
} else {
  config.google = {
    id: 'ID-TO-CHANGE'
  , secret: 'SECRET-TO-CHANGE'
  };
}

// EC2 Parameters
config.ec2 = {
  ami:  "ami-70f96e40", // Ubuntu 12.04 Precise Pangolin
  shutdownBehavior: "stop",
  keyName: "KEY-TO-CHANGE", // Keypair creds
  securityGroup: ["SECURITY-TO-CHANGE"]  // Quick-start security group
}
import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import * as FabricCAServices from 'fabric-ca-client';
import { Gateway, Wallets, X509Identity } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Car, CarTransfer, CreateCar, CreateCarFinance, CreateCarFinancePayment } from './app.model';

@Injectable()
export class AppService {

  async createCarFinancePayment( username: string, data: CreateCarFinancePayment ) {
    try {
      const paymentId = uuidv4();

      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${ username }" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Submit the specified transaction.
      // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
      // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
      await contract.submitTransaction('payCarFinance', data.financeId, paymentId, data.payment.toString(), username, "bank", new Date().toUTCString() );
      console.log(`Transaction has been submitted`);

      // Disconnect from the gateway.
      await gateway.disconnect();

      return this.findOnePayment( username, paymentId );

    } catch (error) {
      throw error;
    }
  }

  async createCarFinance( username: string, data: CreateCarFinance ) {
    try {
      const financeId = uuidv4();

      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${ username }" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Submit the specified transaction.
      // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
      // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
      await contract.submitTransaction('createCarFinance', financeId, data.carId, data.payPerMonth.toString(), username, "bank", new Date().toUTCString() );
      console.log(`Transaction has been submitted`);

      // Disconnect from the gateway.
      await gateway.disconnect();

      return this.findOneFinance( username, financeId );

    } catch (error) {
      throw error;
    }
  }

  async findOneFinance( username: string, financeId: string ) {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      console.error(ccpPath);
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${username}" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Evaluate the specified transaction.
      // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
      // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
      const result = await contract.evaluateTransaction('queryCarFinance', financeId );
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      return JSON.parse(result.toString());
    } catch (error) {
      throw error;
    }
  }

  async findPayment( username: string ) {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      console.error(ccpPath);
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${username}" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Evaluate the specified transaction.
      // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
      // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
      const result = await contract.evaluateTransaction('queryAllCarFinancePayment');
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      return JSON.parse(result.toString());
    } catch (error) {
      throw error;
    }
  }

  async findPaymentByFinance( username: string, financeId: string ) {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      console.error(ccpPath);
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${username}" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Evaluate the specified transaction.
      // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
      // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
      const result = await contract.evaluateTransaction('queryAllCarFinancePaymentByFinance', financeId);
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      return JSON.parse(result.toString());
    } catch (error) {
      throw error;
    }
  }

  async findOnePayment( username: string, paymentId: string ) {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      console.error(ccpPath);
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${username}" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Evaluate the specified transaction.
      // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
      // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
      const result = await contract.evaluateTransaction('queryCarFinancePayment', paymentId );
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      return JSON.parse(result.toString());
    } catch (error) {
      throw error;
    }
  }

  async findFinance( username: string ) {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      console.error(ccpPath);
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${username}" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Evaluate the specified transaction.
      // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
      // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
      const result = await contract.evaluateTransaction('queryAllCarFinances');
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      return JSON.parse(result.toString());
    } catch (error) {
      throw error;
    }
  }

  async transfer( username: string, data: CarTransfer ) : Promise<void> {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${ username }" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Submit the specified transaction.
      // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
      // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
      await contract.submitTransaction('changeCarOwner', data.number, data.newOwner );
      console.log(`Transaction has been submitted`);

      // Disconnect from the gateway.
      await gateway.disconnect();

    } catch (error) {
      throw error;
    }
  }

  async createCar( username: string, data: CreateCar ) : Promise<CreateCar> {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${ username }" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Submit the specified transaction.
      // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
      // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
      await contract.submitTransaction('createCar', data.number, data.brand, data.model, data.color, data.owner);
      console.log(`Transaction has been submitted`);

      // Disconnect from the gateway.
      await gateway.disconnect();

      return data;

    } catch (error) {
      throw error;
    }
  }

  async findCar( username: string ) : Promise<Car[]> {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      console.error(ccpPath);
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${username}" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Evaluate the specified transaction.
      // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
      // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
      const rawData = await contract.evaluateTransaction('queryAllCars');
      console.log(`Transaction has been evaluated, result is: ${rawData.toString()}`);
      const data = JSON.parse(rawData.toString());
      let result: Car[] = [];
      for ( const datum of data ) {
        const car = plainToClass( Car, {
          id: datum.Key,
          color: datum.Record.color,
          inFinance: datum.Record.inFinance,
          make: datum.Record.make,
          model: datum.Record.model,
          owner: datum.Record.owner,
          price: datum.Record.price,
        } as Car );
        result.push( car );
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOneCar( username: string, id: string ) : Promise<Car> {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      console.error(ccpPath);
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get(username);
      if (!identity) {
        throw new UnauthorizedException(`An identity for the user "${username}" does not exist in the wallet`);
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');

      // Evaluate the specified transaction.
      // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
      // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
      const result = await contract.evaluateTransaction('queryCar', id);
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      const data = JSON.parse( result.toString() );
      return plainToClass( Car, {
        id,
        color: data.color,
        inFinance: data.inFinance,
        make: data.make,
        model: data.model,
        owner: data.owner,
        price: data.price,
      } as Car );
    } catch (error) {
      throw error;
    }
  }

  async signIn( username: string ) {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new CA client for interacting with the CA.
      const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
      const ca = new FabricCAServices(caURL);

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const userIdentity = await wallet.get(username);
      if (!userIdentity) {
        throw new ConflictException("User was not found");
      }
    } catch ( error ) {
      throw error;
    }
  }

  async registerAdmin() {
    try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new CA client for interacting with the CA.
      const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
      const caTLSCACerts = caInfo.tlsCACerts.pem;
      const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

      // Create a new file system based wallet for managing identities.
      const walletPath = path.resolve(__dirname, "..", "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the admin user.
      const identity = await wallet.get('admin');
      if (identity) {
        throw new ConflictException('An identity for the admin user "admin" already exists in the wallet');          
      }

      // Enroll the admin user, and import the new identity into the wallet.
      const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
      const x509Identity: X509Identity = {
          credentials: {
              certificate: enrollment.certificate,
              privateKey: enrollment.key.toBytes(),
          },
          mspId: 'Org1MSP',
          type: 'X.509',
      };
      await wallet.put('admin', x509Identity);
      console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
    } catch (error) {
      throw error;
    }
  }

  async register( username: string ) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, "..", "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(username);
        if (userIdentity) {
          throw new ConflictException(`An identity for the user "${ username }" already exists in the wallet`);
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
          throw new ForbiddenException('An identity for the admin user "admin" does not exist in the wallet');
        }

        // build a user object for authenticating with the CA
       const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
       const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client' }, adminUser);
        const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
        const x509Identity: X509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put(username, x509Identity);
        console.log('Successfully registered and enrolled admin user "appUser" and imported it into the wallet');

    } catch (error) {
        throw error;
    }
  }
}

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// middle-ware
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174','https://medic-61958.web.app'],
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hj90b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        // await client.connect(); // Enabled MongoDB connection



        const userCollection = client.db('MedicDB').collection('users');
        const campCollection = client.db('MedicDB').collection('camps');
        const participantCollection = client.db('MedicDB').collection('participant');
        const paymentCollection = client.db('MedicDB').collection('payments');
        const reviewCollection = client.db('MedicDB').collection('reviews'); 

        

        // JWT-related API (create a JWT token)
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '365d'
            });
            res.send({ token });
        });

        // Middlewares
        const verifyToken = (req, res, next) => {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: 'unauthorized access' });
            }
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ message: 'unauthorized access' });
                }
                req.decoded = decoded;
                next();
            });
        };

        // Use verifyAdmin after verifyToken
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            const isAdmin = user?.role === 'admin';

            if (!isAdmin) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            next();
        };




        // Users collection APIs
        app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.get('/user/:email', async(req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            res.send(user);
        });

        app.patch('/user/:email', async(req, res) => {
            const updateUser = req.body;
            const email = req.params.email;
            const filter = { email: email };
            const updatedDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email,
                    phoneNumber: updateUser.phoneNumber,
                    contact: updateUser.contact,
                    image: updateUser.image
                }
            }
    
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        app.get('/users/admin/:email', verifyToken, async (req, res) => {
            const email = req.params.email;

            if (email !== req.decoded.email) {
                return res.status(403).send({ message: 'forbidden access' });
            }

            const query = { email: email };
            const user = await userCollection.findOne(query);
            let admin = false;
            if (user) {
                admin = user?.role === 'admin';
            }
            res.send({ admin });
        });

        app.post('/users', async (req, res) => {
            const user = req.body;

            // Insert email if user doesn't exist
            const query = { email: user.email };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists!', insertedId: null });
            }

            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.patch('/users/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        app.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });



        // Camps collection APIs
        app.get('/camps', async (req, res) => {
            const result = await campCollection.find().toArray();
            res.send(result);
        });

        app.get('/camps/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }; 
            const result = await campCollection.findOne(filter);
            res.send(result);
        });

        app.post('/camps', async (req, res) => {
            const newCamp = req.body;
            const result = await campCollection.insertOne(newCamp);
            res.send(result);
        });

        app.patch('/camps/:id', async (req, res) => {
            const item = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }; // Fixed ObjectId usage
            const updatedDoc = {
                $set: {
                    campName: item.campName,
                    campFees: item.campFees,
                    dateTime: item.dateTime,
                    location: item.location,
                    healthcareProfessional: item.healthcareProfessional,
                    description: item.description,
                    image: item.image
                }
            };

            const result = await campCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        app.delete('/camps/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }; // Fixed ObjectId usage
            const result = await campCollection.deleteOne(query);
            res.send(result);
        });





        // Participant camp collection APIs
        app.get('/register', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await participantCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/register', async (req, res) => {
            const participantCamp = req.body;
            const result = await participantCollection.insertOne(participantCamp);
            res.send(result);
        });

        app.get('/registers', async (req, res) => {
            const result = await participantCollection.find().toArray(); // Fixed incorrect collection
            res.send(result);
        });

        app.get('/register/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }; // Fixed ObjectId usage
            const result = await participantCollection.findOne(filter);
            res.send(result);
        });

        app.delete('/register/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }; // Fixed ObjectId usage
            const result = await participantCollection.deleteOne(query);
            res.send(result);
        });





        // review collection APIs
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });






        // Payment Intent
        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body;
            const amount = parseInt(price * 100);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            });

            res.send({
                clientSecret: paymentIntent.client_secret
            });
        });

        app.get('/payments', verifyToken, verifyAdmin, async (req, res) => {
            const result = await paymentCollection.find().toArray();
            res.send(result);
        });

        app.get('/payments/:email', verifyToken, async (req, res) => {
            const query = { email: req.params.email };
            if (req.params.email !== req.decoded.email) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const result = await paymentCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/payments', async (req, res) => {
            const payment = req.body;
            const paymentResult = await paymentCollection.insertOne(payment);

            // Carefully delete each item from the cart
            const query = { _id: { $in: payment.cartIds.map(id => new ObjectId(id)) } };
            const deleteResult = await participantCollection.deleteMany(query);

            res.send({ paymentResult, deleteResult });
        });

        app.patch('/payments/:id', verifyToken, verifyAdmin, async(req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: 'confirmed'
                }
            }
            const result = await paymentCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        app.delete('/payments/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await paymentCollection.deleteOne(query);
            res.send(result);
        }
    );








        // stats API
        app.get('/stats', async(req, res) => {
            const users = await userCollection.estimatedDocumentCount();
            const totalCamp = await campCollection.estimatedDocumentCount();
            const join = await paymentCollection.estimatedDocumentCount();
    
    
            const result = await paymentCollection.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$price"
                        }
                    }
                }
            ]).toArray();
    
            const revenue = result.length > 0 ? result[0].totalRevenue : 0;
    
            res.send({
                users,
                totalCamp,
                join,
                revenue
            })
        });













    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close(); (commented out to keep server running)
    }
}


run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Medic is live now!');
});

app.listen(port, () => {
    console.log(`Medic is live on port ${port}`);
});
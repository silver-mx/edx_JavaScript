var express = require('express');
var app = express();

var Animal = require('./Animal.js');
var Toy = require('./Toy.js');

app.get('/findToy', (req, res) => {
    var query = {};

    console.log(req.query);

    if (req.query.id) {
        query.id = req.query.id;
        Toy.findOne(query, (err, toy) => {
            if (err) {
                res.json({});
            } else {
                console.log('Toy=>', toy);
                if (toy) {
                    res.json(toy);
                } else {
                    res.json({});
                }
            }
        });
    } else {
        res.json({});
    }
});

app.get('/findAnimals', (req, res) => {
    var query = {};

    console.log(req.query);

    if (req.query.species) {
        query.species = req.query.species;
    }

    if (req.query.gender) {
        query.gender = req.query.gender;
    }

    if (req.query.trait) {
        query.traits = { $in: [req.query.trait] };
    }

    if (Object.keys(query).length == 0) {
        res.json({});
    } else {
        Animal.find(query, '-_id name species breed gender age', (err, animals) => {
            if (err) {
                res.json({});
            } else {
                console.log('Animals=>', animals);

                if (animals.length > 0) {
                    res.json(animals);
                } else {
                    res.json({});
                }
            }
        });
    }
});

app.get('/animalsYoungerThan?', (req, res) => {

    var query = {};
    console.log('Req.query=>', req.query);

    if (req.query.age) {
        query.age = { $lt: req.query.age };

        Animal.find(query, (err, animals) => {
            if (err) {
                console.error(err);
                res.json({});
            } else {
                if (animals.length > 0) {

                    var result = {
                        count: animals.length,
                        names: animals.map((animal) => {
                            return animal.name;
                        })
                    };
                    res.json(result);
                } else {
                    res.json({count:0});
                }
            }
        });

    } else {
        res.json({});
    }
});

app.get('/calculatePrice', (req, res) => {
    
    console.log('calculatePrice query=>', req.query);
    
    if (req.query.id && req.query.qty && req.query.id.length === req.query.qty.length) {
        
        var idToQtyMap = convertToMap(req.query.id, req.query.qty);
        var query = {id: {$in: [...idToQtyMap.keys()]}};

        console.log('Mongo Query =>', query);

        Toy.find(query, 'id price', (err, toys) => {
            
            if(err) {
                console.error(err);
                res.json({});
            } else {
                console.log(toys);
                var itemsSubtotals = getItemsSubtotal(idToQtyMap, toys);
                
                var result = {
                    items: itemsSubtotals,
                    totalPrice: itemsSubtotals.reduce((sum, value) => sum + value.subtotal, 0)
                };
            
                res.json(result);
            }
        });
        
    } else {
        res.json({});
    }
    
});

var convertToMap = (ids, quantities) => {
        
    var map = new Map();
    ids.forEach((id, index) => {
        let qty = parseInt(quantities[index]);
        if (/\d/.test(qty) && qty > 0) {
            
            if (map.has(id)) {
                map.set(id, map.get(id) + qty);
            } else {
                map.set(id, qty);
            }
        }
        
    });

    return map;
}

var getItemsSubtotal = (idToQtyMap, toys) => {
    return toys.map((toy) => {
        let qty = idToQtyMap.get(toy.id);
        return {
            item: toy.id,
            qty: qty,
            subtotal: qty * toy.price 
        };
    });
}


app.listen(3000, () => {
    console.log('Listening on port 3000');
});



// Please do not delete the following line; we need it for testing!
module.exports = app;
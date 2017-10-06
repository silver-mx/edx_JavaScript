var Animal = require('./Animal.js');
var Toy = require('./Toy.js');


var deleteToys = () => {
    Toy.find({}, (err, toys) => {
        console.log('toys found =>', toys);
        toys.forEach((toy) => {
            Toy.remove(toy, (err) => {
                console.log('Removing=>', toy);
            });
        });
    })
}

var insertToy = () => {
    var toy = new Toy({
        id: '1234',
        name: 'Test toy',
        price: 99.99
    });

    toy.save((err, toy) => {
        if (err) return console.error(err);
        return console.log(toy);
    });
}

var insertAnimals = () => {

    var animals = [];

    animals.push(new Animal({
        "name": "Lola",
        "species": "Dog",
        "breed": "Beagle",
        "gender": "female",
        "age": 5,
        traits: ['loyal', 'friendly']
    }));

    animals.push(new Animal({
        "name": "Cooper", "species": "Dog", "breed": "Catahoula", "gender": "male", "age": 11,
        traits: ['crazy', 'funny']
    }));

    animals.push(new Animal({
        "name": "Felix", "species": "Cat", "breed": "Tuxedo", "gender": "male", "age": 98,
        traits: ['loyal', 'funny']
    }));

    animals.push(new Animal({
        "name": "Garfield", "species": "Cat", "breed": "Tabby", "gender": "male", "age": 39,
        traits: ['lazy', 'hungry']
    }));

    console.log('Inserting[', animals.length, '] animals');

    animals.forEach((animal) => {
        animal.save((err, animal) => {
            if (err) return console.err(err);
            console.log('Inserted animal=>', animal);
        });
    });
}

//deleteToys();
insertToy();
insertAnimals();

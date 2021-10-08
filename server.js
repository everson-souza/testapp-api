const express = require('express');
const path = require('path');
const randomId = require('random-id');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;

// place holder for the data
let projects = 
{
    "boem": 
    {
        name: 'BOEM',
        text: 'Outer Continental Shelf (OCS) Air Quality System',
        report: false,
        run: false,
        running: false,
        token: 'cabb914f2ef84dc3b0fb5b6dae045147',
        browsers:
        {
            "chrome": 
            {
                from: 'Chrome',                                    
                color: 'light-blue lighten-1',
                type: '1'
            },
            "firefox": 
            {
                from: 'Firefox',                        
                color: 'orange',
                type: '1',
            }
        },
        otherOptions:
        {
            "508": {
                from: '508',                        
                color: 'green',
                type: '2',
            }
        },
        timeline: 
        {
            "chrome": 
            {
                from: 'Chrome',            
                icon:'fab fa-chrome',
                time: '05/07/2021',
                color: 'light-blue lighten-1',
            },
            "firefox": 
            {
                from: 'Firefox',
                icon:'fab fa-firefox-browser',
                time: '05/12/2021',
                color: 'orange',
            },
            "508": 
            {
                from: '508',
                icon:'',
                time: '01/29/2021',
                color: 'green',
            }
        } 
    },
    "cosd": 
    {
        name: 'COSD',
        text: 'San Diego APCD - Emissions Inventory System (EIS)',
        report: false,
        run: false,
        running: false,
        token: '4e8043a3a5d94fff8472c9143361628f',
        browsers: 
        {
            "chrome":
            {
                from: 'Chrome',                                    
                color: 'light-blue lighten-1',
                type: '1',
                },
            "firefox":
            {
                from: 'Firefox',
                color: 'orange',
                type: '1',                                                
            }
        },                                                               
        otherOptions:
        {
            "508":
            {
                from: '508',                        
                color: 'green',
                type: '2',
                disabled: true
            }
        },
        timeline: 
        {
            "chrome": 
            {
                from: 'Chrome',            
                icon:'fab fa-chrome',
                time: '05/21/2020',
                color: 'light-blue lighten-1',
            },
            "firefox": 
            {
                from: 'Firefox',
                icon:'fab fa-firefox-browser',
                time: '04/01/2020',
                color: 'orange',
            },
            "508": 
            {
                from: '508',
                icon:'',
                time: 'never',
                color: 'green',
            }
        }            
    }, 
    "rtt": 
    {
        name: 'RTT',
        text: '',
        report: false,
        run: false,
        running: false,
        token: 'bf2f7518094a4dd98c3442f0eee7f031',
        browsers: 
        {
            "chrome":
            {
                from: 'Chrome',                                    
                color: 'light-blue lighten-1',
                type: '1',
                },
            "firefox":
            {
                from: 'Firefox',
                color: 'orange',
                type: '1',                                                
            }
        },
        timeline: 
        {
            "chrome": 
            {
                from: 'Chrome',            
                icon:'fab fa-chrome',
                time: 'never',
                color: 'light-blue lighten-1',
            },
            "firefox": 
            {
                from: 'Firefox',
                icon:'fab fa-firefox-browser',
                time: 'never',
                color: 'orange',
            }
        }            
    }
};


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../testapp/dist')));

// Add headers before the routes are defined
var cors = require('cors');

// use it before all route definitions
app.use(cors());

app.get('/api/projects', (req, res) => {
    
    console.log('api/projects called!!!!!!!')
    res.json(projects);
});

app.post('/api/runBat', (req, res) => {
    
    console.log('running bat file')
    const project = req.body.infos.project;
    const browser = req.body.infos.browser;
    console.log(project);
    console.log(browser);

    const token = projects[project].token;
    projects[project].running = true;

    require('child_process').exec(`start ` + __dirname + `"/scripts/test-run.bat" ${project} ${browser} ${token}`, function (err, stdout, stderr) {
        console.log('entrou')
        projects[project].running = false;
        if (err) {            
            console.log(err);            
            console.log('This did not work for some reason')
            
            return console.log(err);
        }

        console.log('All good mate')
        // Done.
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"];
        let data = new Date();
        let dateOfActivity = data.getDate() + "-" + months[(data.getMonth())] + "-" + data.getFullYear()
        
        projects[project].timeline[browser].time = dateOfActivity;

        console.log(projects[project].running)
        console.log(projects[project].timeline[browser].time)
               
        console.log('All good mate')
    });
})

app.post('/api/project', (req, res) => {
  const project = req.body.project;
  project.id = randomId(10);
  console.log('Adding project:::::', project);
  projects.push(project);
  res.json("project addedd");
});

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../testapp/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
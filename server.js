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
                time: '06/14/2021',
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
    }
};


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../testapp/dist')));

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

    projects[project].running = true;

    require('child_process').exec(__dirname + `"/scripts/test-run.bat" ${project} ${browser}`, function (err, stdout, stderr) {
        console.log('entrou')
        if (err) {            
            console.log(err);

            projects[project].running = false;            
            console.log('This did not work for some reason')
            
            return console.log(err);
        }

        // Done.
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"];
        let data = new Date();
        let dateOfActivity = data.getDate() + "-" + months[(data.getMonth())] + "-" + data.getFullYear()
        
        projects[project].timeline[browser].time = dateOfActivity;
        console.log(projects[project].timeline[browser].time)
               
        projects[project].running = false;
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
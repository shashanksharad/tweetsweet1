import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.css';
import BarChart from './components/Barchart';
import HistChart from './components/Histogramchart';
import HistChart2 from './components/Histogramchart_2';
import ImageComponent from './components/ImageComponent';
import Button from "@mui/material/Button";
import { Card, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import * as d3 from "d3";

import { rgb } from 'd3-color';
import { color, margin } from '@mui/system';
import LineChart from './components/Linechart';

import { makeStyles } from '@mui/styles';
import { ClassNames } from '@emotion/react';
import { Slider } from '@mui/material';
import { Typography } from '@mui/material';
import Bubblechart from './components/Bubblechart';
import { Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Autocomplete } from '@mui/material';
import { Backdrop } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { RadioGroup, Radio } from '@mui/material';
import { AppBar, Toolbar } from '@mui/material';
import { Icon } from '@mui/material';
import NetworkGraphChart from './components/network_graph';
import NetworkGraphChart2 from './components/network_graph2';
import WordNetwork from './components/word_network';
import WordNetwork2 from './components/word_network2';
// import WordNetwork3 from './components/word_network3';
import Modal from '@mui/material/Modal';
import { Alert } from '@mui/material';

import axios from 'axios';
// const {google} = require('googleapis');
// http://localhost:8000/api/v1/handle-analytics?handle=Kangna_Ranaut

const fontColor = {
  style: { color: 'white', textAlign: 'right', fontWeight: 'bold', fontSize:'20px'}
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      // Default transform is "translate(14px, 20px) scale(1)""
      // This lines up the label with the initial cursor position in the input
      // after changing its padding-left.
      transform: "translate(34px, 20px) scale(1);"
    }
  },
  inputRoot: {
    color: "white",
    backgroundColor: "white",
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingLeft: 5
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    }
  }
}));

var i = 0;



function App() {

  const topHandles = [
    { label: '@bigguccicraigy'},
    // { label: '@arvindkejriwal'},
    { label: '@elonmusk'}, 
    { label: '@justinbieber'}, 
    { label: '@rihanna'}, 
    { label: '@Cristiano'},
    { label: '@taylorswift13'},
    { label: '@arianagrande'},
    // { label: '@DAMAGEDTROOP410'}, 
    { label: '@KatanaKV'},
    { label: '@noname'},
    { label: '@sza'},
    { label: '@netw3rk'}
  ];

  const [handle, setHandle] = useState(topHandles[0])
  const [inputhandle, setInputHandle] = useState('')

  const[error_text, setErrorText] = useState('')

  // const [alert, setAlert] = useState(false);
  // const [alertContent, setAlertContent] = useState('');

  const [data,  setData] = useState([]);
  // const [graphdata, setGraphdata] = useState({nodes: [{id: "Word1"}, {id: "word2"}, {id: "word3"}, {id: "word4"}], links: [{source: "word1", target: "word2", simalirity: 1}, {source: "word1", target: "word3", simalirity: 1}]});
  const [graphdata, setGraphdata] = useState({nodes: [], links: []})
  const [graphRes,  setGraphRes] = useState([]);
  const [words, setWords] = useState([]);
  const [clearBubble, setClearBubble] = useState(false);
  const [clearGraph, setClearGraph] = useState(false)
  
  const [loading, setLoading] = useState(true);
  const [slider_val, setSliderVal] = useState([0.5])
  const [ntrk_slider_val, setNtrkSliderVal] = useState([0.5])
  const [open, setOpen] = useState(false);

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const classes = useStyles();


  function isEmpty(obj) {
    for(var prop in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
  
    return JSON.stringify(obj) === JSON.stringify({});
  }

  const allTweetData = async (handle_id) => {
    console.log("Started API call for Handle: ")
    console.log(handle_id);
    handle_id = handle_id.replace('@', '');

    // For locally hosted API
    // var url = "http://localhost:8000/api/v1/handle-analytics?handle="+handle_id.toString().toLowerCase();

    // For Accessing API withour Redirects
    // var url = "http://35.245.119.65:8000/api/v1/handle-analytics?handle="+handle_id.toString().toLowerCase();

    // For Redirected API access on Netifly
    var url = "/api/api/v1/handle-analytics?handle="+handle_id.toString().toLowerCase();
    // var url = "https://catfact.ninja/fact";
    axios.get(url)
    .then( response => {
      

      if(response.status === 200)
        {
          console.log("api response:")
          console.log(response)
          if (!isEmpty(response.data)) {
            changeData(response);
            handleClose();
            
            // setAlertContent("Success");
            // setAlert(true);
          }
          else {
            // setAlertContent("The handle has no tweet data for past 7 days!");
            // setAlert(true);
            console.log("The handle has no tweet data for past 7 days!");
            setErrorText(inputhandle+" has no tweet data for past 7 days or it doesn't exist! Please try some other handle.");
            handleOpenModal();
            handleClose();

          }   
        }
      else
        {
          // setAlertContent("Error! Twitter handle not found!");
          // setAlert(true);
          console.log("Error! Twitter handle not found!");
          setErrorText("Error! Twitter handle not found!")
          handleOpenModal();
          handleClose();
        }
    
    })
    .catch(err => {
      console.log(err);
    })
    
  }

  const changeHandle = (value) => {
    console.log("selected handle")
    console.log(value)
    var handle_text = value.label.replace("@", '');
    setHandle("@"+handle_text);
    setInputHandle("@"+handle_text);
  
    
  }

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  // const handleClearGraph = () => {
  //   setOpen(false);
  // };
  // const handleClearBubble = () => {
  //   setOpen(!open);
  // };

  useEffect(() => {
    // all these functions get called every single time the app gets rendered
    // the values in the accompanying array argument are optional and can be given if we want to restrict the function calls only when 
    // those values change
    // console.log("Running useEffect")
    // allTweetData(handle);
    // changeData();
    // changeGraphData();
    // changeWords();
    
  }, [graphdata, ntrk_slider_val]);

  // var i = 0
  var paths = ["/data_u1.csv", "/data_u2.csv"];

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
  }


  function formatISOTimestamp (iso_tmstmp) {
    var year = iso_tmstmp.getFullYear();
    var month = iso_tmstmp.getMonth()+1;
    var dt = iso_tmstmp.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return year+'-' + month + '-'+dt
  }

  function isoStringToDate(s) {
    var b = s.split(/[-t:+]/ig);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
  }

  function clean_tweet (twt) {
    var cl_twt = twt.replaceAll()
  }

  var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");


  const changeData = (res) => {
    var data_twt = [];
    res.data.data.forEach((d) => {
      data_twt.push({
        text: d.text,
        processed_text: d.processed_text,
        label: +d.ts_metrics.is_toxic,
        date: parseTime(d.created_at.substring(0, 18)),
        score: +d.ts_metrics.toxic_yes_prob,
        Retweets: +d.public_metrics.retweet_count,
        Likes: +d.public_metrics.like_count,
        ct_comments: +d.public_metrics.reply_count,
      });
    })

    setData(data_twt);
    
  

    setLoading(false);
    handleClose();
    
    var words_ = generateWordFrequencies(data_twt, slider_val)
      
    words_.forEach(function(r) {
      r.frequency = +r.frequency;
      r.class = +r.class;
    });

    setWords(words_);

    setClearBubble(!clearBubble);


    
    var graphRes_ = res.data.word_similarities;
    setGraphRes(graphRes_);

    var linksdata = generateGraphLinks(graphRes_);
    var nodesdata = generateGraphNodes(graphRes_);
 

    var graph_data;
    graph_data = {nodes: nodesdata, links: linksdata}
    setNtrkSliderVal(0.5);
    setGraphdata(graph_data);
    setClearGraph(!clearGraph);
    

    
    return () => undefined;
  }

  const analyze =() => {
    allTweetData(inputhandle);
    handleToggle();
  }

  const UpdateSliderVal=(e, new_val)=> {
    setSliderVal(new_val)
  }

  const UpdateNtrkSliderVal=(e, new_val)=> {
    setNtrkSliderVal(new_val)
  }

  const changeWords = () => {
    
    var words_ = generateWordFrequencies(data, slider_val)
      
    words_.forEach(function(r) {
      r.frequency = +r.frequency;
      r.class = +r.class;
    });

    setWords(words_);
    setLoading(false);
    return () => undefined;
  }
  
  function wordFreq(string_) {
    var stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your',
    'yours','yourself','yourselves','he','him','his','himself','she','her','hers',
    'herself','it','its','itself','they','them','their','theirs','themselves','what',
    'which','who','whom','this','that','these','those','am','is','are','was','were',
    'be','been','being','have','has','had','having','do','does','did','doing','a',
    'an','the','and','but','if','or','because','as','until','while','of','at','by',
    'for','with','about','against','between','into','through','during','before','after',
    'above','below','to','from','up','down','in','out','on','off','over','under','again',
    'further','then','once','here','there','when','where','why','how','all','any','both',
    'each','few','more','most','other','some','such','no','nor','not','only','own','same',
    'so','than','too','very','s','t','can','will','just','don','should','now']

    // var words = string.replace(/[.]/g, '').split(/\s/);
    var words = string_.split(" ");
    words = words.map(function (d) { return d.toLowerCase()});
    words = words.filter(entry => entry.trim() != '');
    
    var freqMap = {};
    words.forEach(function(w) {
      if(!stopwords.includes(w)) {
        if (!freqMap[w]) {
          freqMap[w] = 0;
      }
      freqMap[w] += 1;
      }
        
    });

    return freqMap;
  }

  function mergeObj(obj1, obj2) {
    const merged = Object.entries(obj2).reduce((acc, [key, value]) => 
      // if key is already in map1, add the values, otherwise, create new pair
      ({ ...acc, [key]: (acc[key] || 0) + value }), { ...obj1 });

      return merged
  }

  function topNWords(obj, n) {
    var props = Object.keys(obj).map(function(key) {
      return { key: key, value: this[key] };
    }, obj);
    props.sort(function(p1, p2) { return p2.value - p1.value; });
    var topN = props.slice(0, n).reduce(function(obj, prop) {
      obj[prop.key] = prop.value;
      return obj;
    }, {});

    return topN
  }



  function generateWordFrequencies(data, thrsh) {
    
    var freqMap_normal = {}
    var freqMap_toxic = {}

    for (var i = 0; i<data.length; i++) {
      if (data[i].score<=thrsh) {
        freqMap_normal = mergeObj(freqMap_normal, wordFreq(data[i].processed_text));
      }
      else {
        freqMap_toxic = mergeObj(freqMap_toxic, wordFreq(data[i].processed_text));
      }
      
    }
    var n = 15
    var topN_normal = topNWords(freqMap_normal, n);
    var topN_toxic = topNWords(freqMap_toxic, n);
    
 
    var words = [];

    for (var key in topN_toxic) {
      words.push({
        word: key,
        frequency: topN_toxic[key],
        class: 1
      });
    }

    for (var key in topN_normal) {
      words.push({
        word: key,
        frequency: topN_normal[key],
        class: 0
      });
    }

    
    return words;

  }
    

  function generateGraphNodes (data) {
    
    // check if an element exists in array using a comparer function
    // comparer : function(currentElement)
    Array.prototype.inArray = function(comparer) { 
      for(var i=0; i < this.length; i++) { 
          if(comparer(this[i])) return true; 
      }
      return false; 
    }; 
  
  // adds an element to the array if it does not already exist using a comparer 
  // function
    Array.prototype.pushIfNotExist = function(element, comparer) { 
        if (!this.inArray(comparer)) {
            this.push(element);
        }
    }; 
  


    var nodesdata = [];

    data.forEach(function(r) {
      var node_s = {id: r.source};
      var node_t = {id: r.target};
      nodesdata.pushIfNotExist(node_s, function (e) {
        return e.id === node_s.id;
      });
      nodesdata.pushIfNotExist(node_t, function (e) {
        return e.id === node_t.id;
      });
    });  

    return nodesdata;
  
     
  }

  function generateGraphLinks (data) {
    var linksdata = [];
    data.forEach(function(j) {
        linksdata.push({
        source: j.source, 
        target: j.target,
        weight: (+j.similarity),
    });
  });
  return linksdata;
}
  const changeGraphData = () => {
    
    var linksdata = generateGraphLinks(graphRes);
    var nodesdata = generateGraphNodes(graphRes);
 

    var graph_data;
    graph_data = {nodes: nodesdata, links: linksdata}
    setNtrkSliderVal(0.5);
    setGraphdata(graph_data);
    
    // UpdateNtrkSliderVal(ntrk_slider_val)
    return () => undefined;
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  return (
    <div className="App">
      {/* <div classname = "Title">
        <h style={{color: '#1DA1F2'}}>#TweetSweet</h>
      </div> */}
      <Box sx={{ flexGrow: 1}}>
        <AppBar position="static" style={{background: 'rgb(2 16 28)' }}>
          <Toolbar >
            <div style={{marginRight: "5px"}}>
              <Icon >
                <img class = "icon-white" src="/twitter_cursing.svg" style = {{width:"25px", height:"25px"}}/>
              </Icon>
            </div>
            <div>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                TweetSweet
              </Typography>
            </div>
          
            
          </Toolbar>
        </AppBar>
      </Box>

      <div className="AppComponents">
      <div id = "analyze" className = "HandleText" style = {{color: "white"}}>
        
        {/* <div id = "an_left" style = {{color:"white"}}><TextField size = "small" id="outlined-basic" label="Handle" variant="standard" InputProps={{
            startAdornment: <InputAdornment position="start" sx={{fontWeight: 'bold'}}>@</InputAdornment>,
            style: { color: 'white', textAlign: 'right', fontWeight: 'bold', fontSize:'20px'}
          }}/>
        </div> */}
        <div id = "an_left" style={{color:"white"}}>
        <Autocomplete
              freeSolo
              classes = {classes}
              id="free-solo-2-demo"
              disableClearable
              value={handle}
              onChange={(event, newValue) => {
                setHandle(newValue);
              }}
              inputValue={inputhandle}
              onInputChange={(event, newInputValue) => {
                setInputHandle(newInputValue);
              }}
              options={topHandles}
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{ height: 10 }}
                  label=""
                  InputProps={{
                    ...params.InputProps,
                    type: "search"
                  }}
                />
              )}
            />


        </div>
        <div id = "an_right" ><Button style={{ background: 'rgb(2 16 28)' }} variant="contained" onClick={analyze}> ANALYZE TWEETS</Button></div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
          <Typography variant="body2"> Please wait! Fetching & Analyzing past 7 days tweets for {inputhandle}.</Typography>
        </Backdrop>

        <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Error!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {error_text}
            </Typography>
          </Box>
        </Modal>

        {/* <div>
        {alert ? <Alert severity='error'>{alertContent}</Alert> : <></> }
        <Modal
        open={open_m}
        onClose={handleCloseM}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
        </div> */}
        
      </div>
      

        <div className = 'Plots'>

        <div id = "slider">
          

            <Box sx={{ '& button': { m: 1 } }}>
                  
                    <RadioGroup row aria-label="position" name="position" defaultValue="combine">
                    <div id="tx_prb_slid_label">
                      <Typography gutterBottom variant="body2">Toxicity Probability Threshold: </Typography>
                    </div>
                    
                    <div id="prob_slider">
                    <Slider aria-label="Custom marks" 
                      size="small" 
                      defaultValue={0.5} 
                      step={0.05} 
                      marks min={0} max={1} 
                      valueLabelDisplay="auto" 
                      marks={[0, 0.2, 0.4, 0.6, 0.8, 1]} 
                      value = {slider_val}
                      onChange = {UpdateSliderVal}
                      />
                    </div>
                    </RadioGroup>
                </Box>
        </div>
          <div id = "wrapper_top" className = 'UpperPlots'>
            <div id = "top_left">
              {/* <Slider defaultValue={0.5} step={0.05} marks min={0} max={1} valueLabelDisplay="auto" marks={[0, 0.2, 0.4, 0.6, 0.8, 1]} /> */}
              
              <h6 id = "plot_title_1">Toxicity Score Distribution</h6>
              <HistChart2 width={300} height={200} data={data} trshld={slider_val}/>
            </div>
            <div id = "top_mid">
              <h6 id = "plot_title_2">Toxicity Engagement by Likes & Retweets</h6>
              <LineChart width={650} height={100} data={data} weight={"Likes"} trshld = {slider_val}/>
              <LineChart width={650} height={100} data={data} weight={"Retweets"} trshld = {slider_val}/>
            </div>
            <div id = "top_right">
              <h6 id = "plot_title_2">Toxicity Meter</h6>
              <div id="textdiv" style={{fontSize: '15px'}}></div>
              {/* <LineChart width={250} height={100} data={data} weight={"ct_retweets"} trshld = {slider_val}/> */}
              <div id = "level_and_score">
                <div id = "level_rects">
                  <svg width="400" height="60px">
                    <rect id = "r01" width="10" height="30" x="0"/>
                    <rect id = "r02" width="10" height="30" x="15"/>
                    <rect id = "r03" width="10" height="30" x = "30"/>
                    <rect id = "r04" width="10" height="30" x = "45"/>
                    <rect id = "r05" width="10" height="30" x = "60"/>
                    <rect id = "r06" width="10" height="30" x = "75"/>
                    <rect id = "r07" width="10" height="30" x = "90"/>
                    <rect id = "r08" width="10" height="30" x = "105"/>
                    <rect id = "r09" width="10" height="30" x = "120"/>
                    <rect id = "r10" width="10" height="30" x = "135"/>
                    <rect id = "r11" width="10" height="30" x = "150"/>
                    <rect id = "r12" width="10" height="30" x = "165"/>
                    <rect id = "r13" width="10" height="30" x = "180"/>
                    <rect id = "r14" width="10" height="30" x = "195"/>
                    <rect id = "r15" width="10" height="30" x = "210"/>
                  </svg>
                  
                </div>
                <div id="scorediv" style={{fontSize: '25px'}}></div>
                <div>
                  <div id = "eng_rects">
                    <svg width="400" height="60px">
                      <rect id = "e01" width="40" height="30" x="0"/>
                      <rect id = "e02" width="40" height="30" x = "45"/>
                      <rect id = "e03" width="40" height="30" x = "90"/>
                      <rect id = "e04" width="40" height="30" x = "135"/>
                      <rect id = "e05" width="40" height="30" x = "180"/>
                    </svg>
                  </div>
                  <div id="engscorediv" style={{fontSize: '14px'}}></div>
                </div>
              </div>
            </div>
            
          </div>
          
          <div id = "wrapper_top">
            <div id = "bot_left">
                <h6 id = "plot_title_3">Word Usage</h6>
                <Box sx={{ '& button': { m: 1 } }}>
                  <div>
                    
                    <RadioGroup id = "radioGrp" row aria-label="position" name="position" defaultValue="combine">
                      <Button id = "generate_wordcloud" size="small" variant="outlined" onClick = {changeWords}>Generate</Button>
                      <FormControlLabel id = "combine" value="combine" control={<Radio />} label="All Words" />
                      <FormControlLabel id = "split" value="split" control={<Radio />} label="Words by Class" />
                      <div id="word-info"></div>
                    </RadioGroup>


                    {/* <Button id = "combine" size="small" variant="outlined">All Words</Button>
                    <Button id ="split" size="small" variant="outlined">Split Words</Button> */}
                    {/* <FormControlLabel control={<Switch id = "switch"/>} label="Split Words" /> */}
                    
                  </div>
                </Box>
                <Bubblechart  width={650} height={400} words={words} trshld={0.5} clearflag = {clearBubble}/>
                
              </div>
              <div id = "bot_right">
                <h6 id = "plot_title_4">Tweet Themes</h6>
                <Box sx={{ '& button': { m: 1 } }}>
                  

                    <RadioGroup id = "radioGrp2" row aria-label="position" name="position" defaultValue="combine">
                      <Button id = "generate_network" size="small" variant="outlined" onClick = {changeGraphData}>Generate</Button>
                    <div id="word_sim_slid_label">
                      <Typography gutterBottom variant="body2">Similarity Threshold:</Typography>
                    </div>
                    
                    
                    <div id="network_slider">
                    <Slider aria-label="Custom marks" 
                        size="small" 
                        defaultValue={0.5} 
                        step={0.05} 
                        marks min={0.5} max={1} 
                        valueLabelDisplay="auto" 
                        marks={[0.5, 0.6, 0.7, 0.8, 0.9, 1]} 
                        value = {ntrk_slider_val}
                        onChange = {UpdateNtrkSliderVal}
                        />
                    </div>
                    {/* <Button id = "generate_communities" size="small" variant="outlined">Louvain Clusters</Button> */}
                      
                     
                    </RadioGroup>
                </Box>
                {/* <NetworkGraphChart width={600} height={400} graphdata={graphdata} /> */}
                <WordNetwork2 width={650} height={400} graphdata={graphdata} thresh={ntrk_slider_val} clearflag = {clearGraph}/>
                {/* <NetworkGraphChart2 width={800} height={400} graphdata={graphdata} /> */}
              </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;

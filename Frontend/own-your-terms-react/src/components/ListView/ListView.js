import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ListView.module.css';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { shadows } from '@mui/system';
import { useParams } from 'react-router-dom';


const tempData = [{
  id: "1",
  title: "Srini frontend coder",
  text: "Srini Rocks"
},{
  id: "2",
  title: "Sriki frontend coder",
  text: "Sriki Rocks"
},{
  id: "3",
  title: "Bhar frontend coder",
  text: "Gav Rocks"
},{
  id: "4",
  title: "Cibi frontend coder",
  text: "Cibi Rocks"
},{
  id: "5",
  title: "Amal frontend coder",
  text: "Amal Rocks"
},
]

function fetchInit(docid){
    if(!docid)
      return tempData[0]?.id;
    return docid;
}

const Chat = () => {
  const {docid} = useParams();
  const [activeDoc,setActiveDoc] = useState(fetchInit(docid));
  return(
    <div className={styles.ListView}>
      
      <Grid container spacing = {3}>
        <Grid item xs = {3} className = {styles.leftGrid}>
          <div className = {styles.filesList}>
          <List>
            {
              tempData.map(data => 
                <ListItem key={data.id} onClick={() => setActiveDoc(data.id)} sx={{ boxShadow: 3}}>
                  <div className = {styles.individualFile}>
                  <Card>
                    <CardActions>
                      <Button variant="text" className = {styles.buttonContent}>
                        <div className = {styles.divContent}>
                        <Typography variant='h6'  component = "div" >
                            {data.title}
                        </Typography>
                        </div>
                      </Button>
                    </CardActions>
                  </Card>
                  </div>
                </ListItem>
              )
            }
            
          </List>
        </div>
        </Grid>

        <Grid item xs = {9}>
          <div className = {styles.currentFile}>
          <div>
              
              <Card className= {styles.currentFileName}>
                <CardContent>
                <Typography variant='h5'  component = "div">
                  {tempData.filter(data => (data.id === activeDoc))[0]?.title}
                </Typography>
              </CardContent>
              </Card>
            </div>
            <Card className={styles.termsContent}>
            <CardContent>
              <div className={styles.termsContent}>
              <Typography variant='h6'  component = "div">
              {tempData.filter(data => (data.id === activeDoc))[0]?.text}
              </Typography>
              </div>
            </CardContent>
          </Card>
            
          </div> 
        </Grid>
      </Grid>
    </div>
  )
}

Chat.propTypes = {};

Chat.defaultProps = {};

export default Chat;
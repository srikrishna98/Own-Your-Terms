import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./ListView.module.css";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { shadows } from "@mui/system";
import { useParams } from "react-router-dom";
import { BACKEND_URL, GET_TITLES_URL, GET_DOCUMENT_URL } from "../../config";
import axios from "axios";

function fetchInit(docid) {
  if (!docid) return "t-mobile Terms and Conditions";
  return docid;
}

const Chat = () => {
  const { docid } = useParams();
  const [docs, setDocs] = useState([]);
  const [activeDoc, setActiveDoc] = useState();
  const [activeId, setActiveId] = useState(docid);
  const [userid, setUserId] = useState(localStorage.getItem("userid"));

  useEffect(() => {
    axios
      .post(BACKEND_URL + GET_TITLES_URL, { userid: userid })
      .then((response) => {
        return setDocs([...docs, ...response.data.response]);
      });
  }, []);

  useEffect(() => {
    if (docs.length == 0) return;
    console.log(activeId);
    if (activeId === undefined) {
      setActiveId(docs[0]);
    }
    axios
      .post(BACKEND_URL + GET_DOCUMENT_URL, {
        user_id_title: userid + (activeId || docs[0]),
      })
      .then((response) => {
        setActiveDoc(response.data.response);
      });
  }, [docs, activeId]);

  return (
    <div className={styles.ListView}>
      <Grid container spacing={3}>
        <Grid item xs={3} className={styles.leftGrid}>
          <div className={styles.filesList}>
            <List>
              {docs.map((doc) => (
                <ListItem
                  key={doc}
                  onClick={() => setActiveId(doc)}
                  sx={{ boxShadow: 3 }}
                >
                  <div className={styles.individualFile}>
                    <Card>
                      <CardContent
                        className={doc == activeId ? styles.activeLeft : ""}
                      >
                        <Button variant="text" className={styles.buttonContent}>
                          <Typography
                            sx={{ wordBreak: "break-word" }}
                            variant="h7"
                            component="div"
                          >
                            {doc}
                          </Typography>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>

        <Grid item xs={9}>
          <div className={styles.currentFile}>
            <div>
              <Card className={styles.currentFileName}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {activeId}
                  </Typography>
                </CardContent>
              </Card>
            </div>
            <Card className={styles.termsContent}>
              <CardContent>
                <div className={styles.termsContent}>
                  <Typography
                    variant="h6"
                    component="div"
                    dangerouslySetInnerHTML={{ __html: activeDoc }}
                  ></Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

Chat.propTypes = {};

Chat.defaultProps = {};

export default Chat;

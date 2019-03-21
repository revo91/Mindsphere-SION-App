import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';


const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: "12px",
    }
})

const types = [
    {
        id: 'GET',
        name: 'GET'
      },
      {
        id: 'PUT',
        name: 'PUT'
      },
      {
          id: 'POST',
          name: 'POST'
      }
]


class Test extends Component {
    state = {
        endpoint: '',
        type: '',
        params: ''
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    callApi = () => {
        axios({
            url: this.state.endpoint,
            method: this.state.type,
            headers : { 'Content-type' : 'application/json' },
            data: this.state.params!==''?this.state.params:null,
            withCredentials: true,
            xsrfCookieName: 'XSRF-TOKEN'
        }).then(res=>{
            console.log(res)
        })
    }

    render() {
        const { classes } = this.props
        return(
            <div className={classes.root}>
                <Grid container direction="row" justify="space-around" alignItems="flex-start" spacing={24}>
                <Grid item xs={12}>
                    <TextField
                    fullWidth={true}
                    id="type"
                    select
                    label="Type"
                    value={this.state.type}
                    onChange={this.handleChange('type')}
                    margin="normal"
                    disabled={this.props.textFieldsDisabled}
                    >
                    {types.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name}
                    </MenuItem>
                    ))}
                </TextField>
                </Grid>
                    <Grid item xs={12}>
                        <TextField
                        id="api"
                        label="API endpoint"
                        value={this.state.endpoint}
                        onChange={this.handleChange('endpoint')}
                        margin="normal"
                        fullWidth={true}
                        />
                    </Grid>
                <Grid item xs={12}>
                    <TextField
                    id="params"
                    label="Params (optional)"
                    value={this.state.params}
                    onChange={this.handleChange('params')}
                    margin="normal"
                    fullWidth={true}
                    />
                </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth={true} onClick={()=>this.callApi()}
                        disabled={this.state.type==='' || this.state.endpoint===''?true:false}>Call API</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Test);
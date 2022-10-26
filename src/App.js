import './App.css';
import { Octokit } from "@octokit/core";
import { useEffect } from 'react';
import { useState } from 'react';


const getWorkflowRun = async (repo) => {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    const result = await octokit.request('GET /repos/dhis2/{repo}/actions/workflows/dhis2-verify-commits.yml/runs', {
        branch: 'verify-commit-test',
        repo,
    });

    const { status, conclusion, html_url } = result.data['workflow_runs'][0];
    
    return {
        status,
        conclusion,
        html_url,
    };
};

function App() {
    const [captureAppData, setCaptureAppData] = useState();
    const [lineListingAppData, setlineListingAppData] = useState();

    useEffect(() => {
        getWorkflowRun('capture-app').then(res => {
            setCaptureAppData(res);
        });

        getWorkflowRun('line-listing-app').then(res => {
            setlineListingAppData(res);
        });
    }, []);

    let  captureAppResult = "";
    if (!captureAppData) {
    } else if (captureAppData.status === 'completed') {
        captureAppResult = captureAppData.conclusion; 
    } else {
        captureAppResult = captureAppData.status;
    }

    let lineListingAppResult = "";
    if (!lineListingAppData) {
    } else if (lineListingAppData.status === 'completed') {
        lineListingAppResult = lineListingAppData.conclusion; 
    } else {
        lineListingAppResult = lineListingAppData.status;
    }
    debugger;   
    return (
        <>
            <b>Verify commits workflow</b>
            <p></p>
            <div>
                Capture app: {captureAppResult}
                { captureAppData ? (<a href={captureAppData?.html_url}>link</a>) : null }
            </div>
            <div>
                Line listing app: {lineListingAppResult}
                { lineListingAppData ? (<a href={lineListingAppData?.html_url}>link</a>) : null }
            </div>
        </>
    );

}

export default App;

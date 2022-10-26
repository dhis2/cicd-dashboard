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

    return (
        <div style={{ margin: 30 }}>
            <h1>Workflow status overview</h1>
            <p></p>
            <b>Capture app</b>
            <p></p>
            <div>
                Verify commits workflow: {' '}
                { captureAppData ? (<a href={captureAppData?.html_url} target="_blank">{captureAppResult}</a>) : null }
            </div>
            <p></p>
            <b>Line listing app</b>
            <p></p>
            <div>
                Verify commits workflow: {' '}
                { lineListingAppData ? (<a href={lineListingAppData?.html_url} target="_blank">{lineListingAppResult}</a>) : null }
            </div>
        </div>
    );

}

export default App;

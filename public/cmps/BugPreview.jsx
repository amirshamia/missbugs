import { utilService } from "../services/util.service.js"

export function BugPreview({ bug }) {

    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>  created at:  <span>{utilService.getDate(bug.createdAt)}</span></p>
        <p>  creator:  <span>{bug.creator.fullname}</span></p>

    </article>
}

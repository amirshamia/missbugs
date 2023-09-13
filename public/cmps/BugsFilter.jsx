const { useState, useEffect } = React

export function BugsFilter({ filterBy, setFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)


    useEffect(() => {
        setFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }






    const { title, severity, label } = filterByToEdit
    return (
        <section className="bugs-filter">
            <h2>Filter Our Bugss</h2>

            <label htmlFor="title">Title: </label>
            <input value={title} onChange={handleChange} type="text" placeholder="By Title" id="title" name="title" />

            <label htmlFor="severity">Min severity: </label>
            <input value={severity} onChange={handleChange} type="number" placeholder="By severity" id="severity" name="severity" />


            <select value={label} onChange={handleChange} name="label" id="label">
                <option value="need-CR">need-CR</option>
                <option value="dev-branch">dev-branch</option>
                <option value="critical">critical</option>
            </select>

        </section>
    )
}
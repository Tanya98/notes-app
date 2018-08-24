import './styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';

class Note extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = { backgroundColor: this.props.color };
        return (
            <div className="notes-grid">
                <div className="note" style={style}>
                    <span className="delete-note" onClick={this.props.onDelete}> × </span>
                    {this.props.children}
                </div>
            </div>
        );
    }
};

class NoteEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleNoteAdd = this.handleNoteAdd.bind(this);
    }

    handleTextChange(event) {
        this.setState({ text: event.target.value });
    }

    handleNoteAdd() {
        var newNote = {
            text: this.state.text,
            color: this.state.color,
            id: Date.now()
        }
        this.props.onNoteAdd(newNote);
        this.setState({ text: '' });
    }

    render() {
        return (
            <div className="note-editor">
                <textarea
                    placeholder="Enter your note here..."
                    rows={5}
                    className="textarea"
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <button className="add-button" onClick={this.handleNoteAdd}>Add</button>
            </div>
        );
    }
};

class NotesGrid extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var grid = this.refs.grid;
        this.msnry = new Masonry(grid, {
            itemSelector: '.note',
            columnWidth: 15,
            gutter: 8,
            isFitWidth: true
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    }

    render() {
        const onNoteDelete = this.props.onNoteDelete;
        return (
            <div className="notes-grid" ref="grid">
                {
                    this.props.notes.map(function (note) {
                        return (
                            <Note
                                key={note.id}
                                onDelete={onNoteDelete.bind(null, note)}
                                color={note.color}>
                                {note.text}
                            </Note>
                        );
                    })
                }
            </div>
        );
    }
};

class NotesApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [
                { id: 4, text: 'React — это инструмент для создания пользовательских интерфейсов', color: 'green' },
                { id: 5, text: 'Redux — это небольшая библиотека, в которой соглашения и API были тщательно продуманы для удобного создания инструментов и подключения расширений экосистемы.', color: 'pink' }
            ],
        }
        this.handleNoteDelete = this.handleNoteDelete.bind(this);
        this.handleNoteAdd = this.handleNoteAdd.bind(this);
    }

    componentDidMount() {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        if (localNotes) {
            this.setState({ notes: localNotes });
        }
    }

    componentDidUpdate() {
        this._updateLocalStorage();
    }

    handleNoteDelete(note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter((note) => {
            return note.id !== noteId;
        });
        this.setState({ notes: newNotes });
    }

    handleNoteAdd(newNote) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({ notes: newNotes });
    }

    render() {
        return (
            <div className="notes-app">
                <h2 className="app-header">NotesApp</h2>
                <NoteEditor onNoteAdd={this.handleNoteAdd} />
                <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete} />
            </div>
        );
    }

    _updateLocalStorage() {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    }
}

ReactDOM.render(
    <NotesApp />,
    document.getElementById('root')
);



'use strict';

var React = require('react');
var Application = require('core/Application.js');
var Scene = require('display/Scene.js');
var FX = require('FX.js');

var Header = require('ui/Header.jsx');
var Body = require('ui/Body.jsx');
var Footer = require('ui/Footer.jsx');
var MenuBar = require('ui/MenuBar.jsx');
var MainView = require('ui/MainView.jsx');
var Stage = require('ui/Stage.jsx');
var Player = require('ui/Player.jsx');
var Spectrum = require('ui/Spectrum.jsx');
var Oscilloscope = require('ui/Oscilloscope.jsx');
var Waveform = require('ui/Waveform.jsx');
var Overlay = require('ui/Overlay.jsx');
var ControlDock = require('ui/ControlDock.jsx');

var ModalWindow = require('ui/windows/ModalWindow.jsx');
var AboutWindow = require('ui/windows/AboutWindow.jsx');
var SettingsWindow = require('ui/windows/SettingsWindow.jsx');
var ControlPickerWindow = require('ui/windows/ControlPickerWindow.jsx');

var App = React.createClass({
    getInitialState: function() {
        return {
            filename: '',
            showModal: false,
            modal: null
        };
    },

    componentWillMount: function() {
        var scene = new Scene();

        Application.stage.addScene(scene);

        scene.addDisplay(new FX.TextDisplay());
        scene.addDisplay(new FX.BarSpectrumDisplay());
        scene.addDisplay(new FX.ImageDisplay());

        Application.on('error', function(err) {
            this.showError(err);
        }.bind(this));

        Application.on('pick_control', function(scene) {
            this.showModal(
                <ControlPickerWindow title="ADD CONTROL" scene={scene} onClose={this.hideModal} />
            );
        }.bind(this));
    },

    componentDidMount: function() {
        this.fileForm = React.findDOMNode(this.refs.form);
        this.fileInput = React.findDOMNode(this.refs.file);
        this.fileInput.setAttribute('nwsaveas', '');
        this.fileAction = null;
    },

    handleClick: function() {
        this.refs.menu.setActiveIndex(-1);
    },

    handleDragDrop: function(e) {
        e.stopPropagation();
        e.preventDefault();
    },

    handleMouseDown: function(e) {
        Application.emit('mousedown');
    },

    handleMouseUp: function(e) {
        Application.emit('mouseup');
    },

    handleFileAction: function(e) {
        e.preventDefault();

        var files = e.target.files;

        if (files.length > 0) {
            this.fileAction(files[0]);
            this.fileForm.reset();
        }
    },

    handleMenuAction: function(action, checked) {
        switch (action) {
            case 'File/New Project':
                break;

            case 'File/Open Project':
                this.loadFileDialog(function(file) {
                    Application.loadProject(file);
                }.bind(this), '');
                break;

            case 'File/Save Project':
                this.loadFileDialog(function(file) {
                    Application.saveProject(file);
                }.bind(this), 'project.afx');
                break;

            case 'File/Load Audio':
                this.loadFileDialog(function(file) {
                    this.loadAudioFile(file);
                }.bind(this), '');
                break;

            case 'File/Save Image':
                this.loadFileDialog(function(file) {
                    Application.saveImage(file);
                }.bind(this), 'image.png');
                break;

            case 'File/Save Video':
                this.loadFileDialog(function(file) {
                    Application.saveVideo(file);
                }.bind(this), 'video.mp4');
                break;

            case 'Edit/Settings':
                this.showModal(<SettingsWindow onClose={this.hideModal} />);
                break;

            case 'View/Control Dock':
                this.refs.dock.showDock(!checked);
                this.refs.menu.setCheckState(action, !checked);
                break;

            case 'Help/About':
                this.showModal(<AboutWindow onClose={this.hideModal} />);
                break;
        }
    },

    loadFileDialog: function(action, filename) {
        this.fileAction = action;

        if (filename) {
            this.fileInput.setAttribute('nwsaveas', filename);
        }
        else {
            this.fileInput.removeAttribute('nwsaveas');
        }

        this.fileInput.click();
    },

    showModal: function(modal) {
        this.setState({ modal: modal, showModal: true });
    },

    hideModal: function() {
        this.setState({ showModal: false });
    },

    showError: function(error) {
        this.showModal(
            <ModalWindow title="ERROR" onClose={this.hideModal}>
                {error.message}
            </ModalWindow>
        );
    },

    loadAudioFile: function(file) {
        var scene = this.refs.scene,
            err = function(error) {
                this.showError(error);
            }.bind(this);

        scene.showLoading(true);

        Application.loadAudioFile(file)
            .then(function(data) {
                return Application.loadAudioData(data);
            })
            .catch(err)
            .then(function() {
                scene.showLoading(false);
            });
    },

    render: function() {
        return (
            <div
                id="container"
                onClick={this.handleClick}
                onDrop={this.handleDragDrop}
                onDragOver={this.handleDragDrop}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}>
                <Header />
                <MenuBar
                    ref="menu"
                    onMenuAction={this.handleMenuAction}
                />
                <Body>
                    <Overlay visible={this.state.showModal}>
                        {this.state.modal}
                    </Overlay>
                    <MainView>
                        <Stage ref="scene" onFileDropped={this.loadAudioFile} />
                        <Spectrum ref="spectrum" />
                        <Oscilloscope ref="osc" />
                        <Waveform ref="waveform" />
                        <Player ref="player" />
                    </MainView>
                    <ControlDock ref="dock" />
                </Body>
                <Footer
                    filename={this.state.filename}
                />
                <form ref="form" className="off-screen">
                    <input
                        ref="file"
                        type="file"
                        onChange={this.handleFileAction}
                    />
                </form>
            </div>
        );
    }
});

module.exports = App;
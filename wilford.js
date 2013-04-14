// wilford.js

var Wilford = (function ()
{
  var prototype = Wilford.prototype;
  var constructor = Wilford;

  function Wilford(el, sounds)
  {
    this.el = $(el);
    this.sounds = sounds;
    this.audioObjects = {};
    this.buttons = {};
    this.makeSoundboard();

    return this;
  }

  prototype.addButton = function(row, letter)
  {
    var button = $("<div class='-wf-button'>");
    this.buttons[letter] = button;

    // make the button display its corresponding letter in a div.-wf-letter
    $("<div class='-wf-letter'>").html(letter).appendTo(button);

    if (sounds.hasOwnProperty(letter)) {
      var sound = sounds[letter];
      // make the button display the sound's name
      button.append(sound[0]);
    } else {
      // otherwise show that it's empty.
      button.addClass("-wf-empty");
      button.append("N/A");
    }

    button.appendTo(row);

    var audioObject = this.audioObjects[letter];
    button.click(function(){ audioObject.play(); });

    return button;
  };

  prototype.addRow = function(letters)
  {
    var row = $("<div class='-wf-row'>");
    row.appendTo(this.el);

    for (var i = 0; i < letters.length; i += 1) {
      var letter = letters.charAt(i);
      this.addButton(row, letter);
    }

    return row;
  };

  prototype.setupSounds = function()
  {
    for (letter in this.sounds)
    {
      var audio = $("<audio>", { preload: true, autobuffer: true });
      this.audioObjects[letter] = audio[0];

      var filename = sounds[letter][1];
      $("<source>", { src: filename }).appendTo(audio);
      audio.appendTo(document.body);
    }
  };

  prototype.bindKeys = function()
  {
    var audioObjects = this.audioObjects;
    var buttons = this.buttons;
    $(document).keypress(function(e)
    {
      var charCode = e.which;
      if (charCode)
      {
        var letter = String.fromCharCode(charCode).toLowerCase();

        var button = buttons[letter];
        var audio = audioObjects[letter];
        if (audio)
        {
          button.addClass("-wf-depressed");
          audio.pause();
          audio.play();
          setTimeout(function(){ button.removeClass("-wf-depressed"); }, 100);
        }
      }
    });
  };

  prototype.makeSoundboard = function()
  {
    this.setupSounds();

    this.el.addClass("-wf-soundboard");
    this.el.html("");

    this.addRow("qwertyuiop");
    this.addRow("asdfghjkl");
    this.addRow("zxcvbnm");

    this.bindKeys();

    return this;
  };

  return Wilford;
}());

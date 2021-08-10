(function (blocks, editor, components, element, hooks, dataHandler){
  var el = element.createElement
  var registerBlockType = blocks.registerBlockType
  var RichText = editor.RichText
  var BlockControls = editor.BlockControls
  var AlignmentToolbar = editor.AlignmentToolbar
  var MediaUpload = editor.MediaUpload
  var InspectorControls = editor.InspectorControls
  var AlignmentToolbar = editor.AlignmentToolbar
  var TextControl = components.TextControl
  var SelectControl = components.SelectControl
  var InnerBlocks = editor.InnerBlocks
  var withSelect = dataHandler.withSelect
  
  var blockStyle = {
      backgroundColor: '#900',
      color: '#fff',
      padding: '20px',
  };
  const REVEAL_ALLOWED_BLOCKS = [  'core/paragraph',  'core/gallery', 'core/pullquote', 'core/file', 'core/html',  'core/button', 'core/list', 'core/heading','core/table'];

  function makeImageRelative(url){
    if(BLOCKCONFIG && BLOCKCONFIG.relativePaths === 0){
      return url;
    }
    urlFrags = url.toUpperCase().split("://");
    if(urlFrags[1].indexOf(BLOGINFO.uploadURL.toUpperCase()) === 0){
      return urlFrags[1].replace(BLOGINFO.blogUrl.toUpperCase(), "").toLowerCase();
    } else{
      return urlFrags.join("://").toLowerCase();
    }
  }
  
  function makeDurationReadable(mediaObj){
    if(!mediaObj.fileLength){
      return null;
    }
    newArgs = mediaObj.fileLength.split(":");
    if(newArgs.length == 1){
      return "PT0M" + newArgs[0] + "S" ;
    }
    if(newArgs.length == 2){
      return "PT" + newArgs[0] +"M" + newArgs[1] + "S" ;
    }
    if(newArgs.length == 3){
      return "PT" + newArgs[0] + "H" + newArgs[1] +"M" + newArgs[2] + "S" ;
    }
  }

  function addListBlockParent( settings, name ) {
    //if(name === "mhbasictheme-layout/reveal-block"){ return settings;}
    var match = REVEAL_ALLOWED_BLOCKS.filter(function(el){
      return el === name;
    });
    if (match.length > 0) {
        settings["parent"] =  [ 'mhbasictheme-layout/post-part' ];
    }
    
    return settings;
  }

  

  
  hooks.addFilter(
      'blocks.registerBlockType',
      'mhbasictheme-layout/post-parts-reveal',
      addListBlockParent
  );


  blocks.registerBlockType( 'mhbasictheme-layout/post-part', {
    title: 'Flexible Content Blocks',
    icon: 'layout',
    supports: {  anchor: true },
    category: 'common',
    className: "post-part",
    example: {},
    attributes: { // Necessary for saving block content.
      author: {
        type: 'string',
        source: 'meta',
        meta: 'author'
      },
      alignment: {
        type: 'string',
        default: 'left'
      },
      mediaID: {
        type: 'number'
      },
      mediaAlt: {
        type: 'string'
      },
      mediaSizes: {
        type: 'object'
      },
      mediaDuration: {
        type: 'string',
      },
      mediaType: {
        type: 'string',
        default: 'image'
      },
      mediaURL: {
        type: 'string',
      },
      mediaPosterURL: {
        type: 'string',
        default: null
      },
      mediaCaptionID: {
        type: 'number',
      },
      mediaStart: {
        type: 'String',
      },
      mediaEnd: {
        type: 'String',
      },
      mediaDate: {
        type: 'String',
      },
      mediaCaptionURL: {
        type: 'string',
      },
      hasMediaCaption: {
        type: 'bool',
        default: false
      },
      sectionMediaLocation: {
        type: 'number',
        default: 1
      },
      sectionMediaStart: {
        type: 'string'
      },
      sectionMediaEnd: {
        type: 'string'
      },
      hasNestedBlocks: {
        type: 'bool',
        default: false
      },
      colAmount: {
        type: 'number',
        default: 1
      },
      mediaAmount:{
        type: 'number',
        default: 1
      },
      body:{
        type: 'html',
        source: 'children',
        selector: '.section-content-body-text',
      },
      media2ID: {
        type: 'number'
      },
      media2Alt: {
        type: 'string'
      },
      media2Sizes: {
        type: 'object'
      },
      media2Duration: {
        type: 'string',
      },
      media2URL: {
        type: 'string',
      },
      boxTwotransition: {
        type: 'string',
      },
      boxOnetransition: {
        type: 'string',
      },
      boxTwotransitionTime: {
        type: 'number'
      },
      boxOnetransitionTime: {
        type: 'number'
      },
      boxTwotransitionDelay: {
        type: 'number',
      },
      boxOnetransitionDelay: {
        type: 'number',
      },
      mediaLink: {
        type: 'string'
      },
      media2Link: {
        type: 'string'
      },
      mediaLinkTarget: {
        type: 'bool',
        default: false
      },
      mediaLink2Target: {
        type: 'bool',
        default: false
      },
      sectionSticky: {
        type: 'bool',
        default: false
      },
    },
    edit:  withSelect(function (select, blockData) {
      return {
        innerBlocks: select('core/block-editor').getBlocks(blockData.clientId),
        posts: select( 'core' ).getEntityRecords( 'postType', 'post'),
        pages: select( 'core' ).getEntityRecords( 'postType', 'page')
      };
    })(function(props) {
       // options for SelectControl
          var linkOptions = [];

        // if posts found
        if( props.posts ) {
          linkOptions.push( { value: 0, label: 'Select something' } );
          props.posts.forEach((post) => { // simple foreach loop
            //console.log(post.link);
                    linkOptions.push({value:post.id, label:post.title.rendered, link: post.link});
                });
            } else {
                linkOptions.push( { value: 0, label: 'Loading...' } )
        }
        if( props.pages ) {
                props.pages.forEach((post) => { // simple foreach loop
                    linkOptions.push({value:post.id, label:post.title.rendered, link: post.link});
                });
            }

        if(props.innerBlocks.length < 1 || (props.innerBlocks.length == 1 && props.innerBlocks[0].attributes.content == "")){
          props.setAttributes({hasNestedBlocks: false});
        } else{
          props.setAttributes({hasNestedBlocks: true});
        }
      //console.log(props.attributes.hasNestedBlocks);

      var attributes = props.attributes
      var alignment = props.attributes.alignment
      var toolbarControls = [
        {
          icon: 'align-pull-left',
          title:  'Show media on left' ,
          isActive: attributes.sectionMediaLocation === 1 && attributes.mediaAmount == 1,
          onClick: function (){ changeMediaLocation(1); /*console.log("clicked left") */}
        },
        {
          icon: 'align-pull-right',
          title: 'Show media on right' ,
          isActive: attributes.sectionMediaLocation === 2 && attributes.mediaAmount == 1,
          onClick: function (){ changeMediaLocation(2);/*console.log("clicked right")*/},
        },
        {
          icon: 'text',
          title: 'Show no media' ,
          isActive: attributes.sectionMediaLocation === 0 && attributes.mediaAmount == 1,
        onClick: function (){ changeMediaLocation(0); props.setAttributes({ colAmount: 2, mediaAmount: 1}); /*console.log("clicked none")*/},
        },
      ];

      var onChangeAlignment = function(newAlignment) {
        return props.setAttributes({ alignment: newAlignment })
      }

      var postComplete = function(feildId) {
        var linkObjects = linkOptions;
        var postAutocompleter = {
            name: 'postLink',
            className: 'post-auto-complete',
            options: linkObjects,
            triggerPrefix: '/',
            getOptionLabel: function(option) {
              return  el('span', {}, option.label ? option.label : "[No title]");
            },
            getOptionKeywords: function(option) {
              return [option.label,option.link];
            },
            isOptionDisabled: function(option) {
              return option.label === 'Loading...';
            },
            getOptionCompletion: function(option) {
              //return el('abbr', {value: option.value, title: option.label});
              //console.log(option);
              return option.link;
            }
          
        };
      
    
        return el(RichText, {
            className: "show-posts-link-ui",
            placeholder: "Type \'/\' to search all posts:",
            onChange: function(content){
              var toSave = new Object();
              toSave[feildId] = content;
              props.setAttributes(toSave);
            },
            autocompleters: [postAutocompleter],
            keepPlaceholderOnFocus: true,
            value: props.attributes[feildId]
          }
        
        );
      }
      var onSelectImage = function(media) {
        let today = new Date()
        var mediaUrl = media.url;
        if(media.sizes){
          if(media.sizes['large-format'] && media.sizes['large-format']['url']){
            mediaUrl = media.sizes['large-format'] ['url'];
          } else if(media.sizes['mhbasictheme-fullscreen'] && media.sizes['mhbasictheme-fullscreen']['url']){
            mediaUrl = media.sizes['mhbasictheme-fullscreen'] ['url'];
          } else{
            mediaUrl = media.sizes['full'] ['url'];
          }
        }
        if(attributes.sectionMediaLocation < 1){
          props.setAttributes({sectionMediaLocation: 1});
        }
     
        return props.setAttributes({
          mediaURL: makeImageRelative(mediaUrl),
          mediaID: media.id,
          mediaSizes: media.sizes ? media.sizes : null,
          mediaAlt: media.alt,
          mediaPosterURL: null,
          mediaDuration: media.type == "video" ? makeDurationReadable(media) : null,
          mediaCaptionURL: null,
          mediaType: media.type,
          mediaDate: today.toISOString()
        })
      }
        
      var onSelectImage2 = function(media) {
        var mediaUrl = media.url;
        if(media.sizes){
          if(media.sizes['large-format'] && media.sizes['large-format']['url']){
            mediaUrl = media.sizes['large-format'] ['url'];
          } else if(media.sizes['mhbasictheme-fullscreen'] && media.sizes['mhbasictheme-fullscreen']['url']){
            mediaUrl = media.sizes['mhbasictheme-fullscreen'] ['url'];
          } else{
            mediaUrl = media.sizes['full'] ['url'];
          }
        }
        return props.setAttributes({
          media2URL: makeImageRelative(mediaUrl),
          media2ID: media.id,
          media2Alt: media.alt,
          media2Duration: media.type == "video" ? makeDurationReadable(media) : null,
          media2Sizes: media.sizes ? media.sizes : null,
          mediaType: media.type
        })
      }


      var onSelectCaption = function(media) {
        props.setAttributes({mediaCaptionID: media.id, mediaCaptionURL: media.url, hasMediaCaption: true});
      }

      var onSelectPoster = function(media) {
        props.setAttributes({mediaPosterURL: makeImageRelative(media.url)});
      }
      changeMediaLocation = function(type){
        if(type === 0){
          return props.setAttributes({
            mediaURL: "",
            mediaID: "",
            mediaAlt:  "",
            mediaSizes: null,
            mediaType: "image",
            sectionMediaLocation: type,
            hasMediaCaption: false,
            mediaCaptionID: "",
            mediaCaptionURL: "",
            mediaPosterURL: null,
            mediaDate: "",
            mediaDuration: null,
            media2URL: "",
            media2ID: "",
            media2Alt: "",
            mediaAmount: 1,
            media2Duration: null,
            media2Sizes: null,
          })
        } else{
          return props.setAttributes( { sectionMediaLocation: type, colAmount: 1, mediaAmount: 1 } );
        }
       
      }

      return [
        
        el(BlockControls, { key: 'controls' }, // Display controls when the block is clicked on.
          el('div', { className: 'components-toolbar' },
            el(AlignmentToolbar, {
              value: alignment,
              onChange: onChangeAlignment
            }),
            el(BlockControls, {
              controls: toolbarControls
            }),
            props.attributes.colAmount == 1 && el(MediaUpload, {
              onSelect: onSelectImage,
              type: 'button',
              title: 'Manage Media' ,
              render: function (obj) {
                return el(components.Button, {
                  className: 'components-icon-button components-toolbar__control',
                  title: 'Manage Media' ,
                  onClick: obj.open,
                  style: {"min-width": "45px"}
                },
                // Add Dashicon for media upload button.
                el('span', {}, "1"),
                el('svg', { className: 'dashicon dashicons-edit', width: '20', height: '20' },
                  el('path', { d: 'M2.25 1h15.5c.69 0 1.25.56 1.25 1.25v15.5c0 .69-.56 1.25-1.25 1.25H2.25C1.56 19 1 18.44 1 17.75V2.25C1 1.56 1.56 1 2.25 1zM17 17V3H3v14h14zM10 6c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm3 5s0-6 3-6v10c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V8c2 0 3 4 3 4s1-3 3-3 3 2 3 2z' })
                ))
              }
            }),

            props.attributes.mediaAmount == 2 && el(MediaUpload, {
              onSelect: onSelectImage2,
              type: 'image',
              render: function (obj) {
                return el(components.Button, {
                  className: 'components-icon-button components-toolbar__control',
                  onClick: obj.open,
                  style: {"min-width": "45px"}
                },
                // Add Dashicon for media upload button.
                el('span', {}, "2"),
                el('svg', { className: 'dashicon dashicons-edit', width: '20', height: '20' },
                  el('path', { d: 'M2.25 1h15.5c.69 0 1.25.56 1.25 1.25v15.5c0 .69-.56 1.25-1.25 1.25H2.25C1.56 19 1 18.44 1 17.75V2.25C1 1.56 1.56 1 2.25 1zM17 17V3H3v14h14zM10 6c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm3 5s0-6 3-6v10c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V8c2 0 3 4 3 4s1-3 3-3 3 2 3 2z' })
                ))
              }
            }),
          ),
          /* Display alignment toolbar within block controls.
          el(ListToolbar, {
            //value: alignment,
            onChange: function(){
              //nothing
            }
          })*/
        ),
        //sidebar controls here
        el(InspectorControls, { key: 'inspector' }, // Display the block options in the inspector panel.
          
        attributes.mediaType != 'image' && el(components.PanelBody, {
          title: 'Section Video Cuts',
          className: 'block-media-info',
          initialOpen: true
            },
            el('p', {}, 'Time in seconds'),
              // buttongroup type.
              el('p', {},
              el('p', {
                className: 'video-timings'
                },
                
                el(TextControl, {
                  tagName: 'span',
                  placeholder: 'Start',
                  style: {"font-size": "20px", width: "60px", height: "40px", padding: "5px", display: "inline-block"},
                  keepPlaceholderOnFocus: true,
                  value: attributes.sectionMediaStart,
                  onChange: function (newStart) {
                      var startItem = newStart.replace(/[^0-9// ]/g, "");
                      props.setAttributes({ sectionMediaStart: startItem })
                    },
                  }),
                
                  el(TextControl, {
                    tagName: 'span',
                    placeholder: 'End',
                    style: {"font-size": "20px", width: "60px", height: "40px", padding: "5px", display: "inline-block"},
                    keepPlaceholderOnFocus: true,
                    value: attributes.sectionMediaEnd,
                    onChange: function (newE) {
                        var startItem = newE.replace(/[^0-9// ]/g, "");
                        props.setAttributes({ sectionMediaEnd: startItem })
                      },
                    }),
              )
            )
            
            ),
            el(components.PanelBody, {
              title: 'Options and Configuration',
              className: 'image-block-count-info',
              initialOpen: true
            },
            
              // buttongroup type.
              attributes.colAmount == 1 && el('p', {}, 'Media Amount'),
              attributes.colAmount == 1 && el('p', {
                className: 'image-amount-selection'
                },
                el(components.ButtonGroup, {
                  className: 'section-text-location-selection-container',
                  },
                  el(components.Button, {
                    className: props.attributes.mediaAmount == 1 ? 'button button-large is-primary' : 'button button-large',
                    onClick: function(e){  props.setAttributes({ mediaAmount: 1 }) }
                    },
                    '1'
                  ),
                  el(components.Button, {
                    className: props.attributes.mediaAmount == 2 ? 'button button-large is-primary' : 'button button-large',
                    onClick: function(e){  props.setAttributes({ mediaAmount: 2 }) }
                    },
                    '2'
                  )
                )
              ),
              el('p', {}, 'Section Focus'),
              el('p', {
                className: 'editor-bordered-input'
                },
                el( components.ToggleControl,
                  {
                    label: 'section is sticky',
                    //help:  props.attributes.mediaLinkTarget ? 'Opens Link in new Window.' : 'Open in current Window',
                    checked: props.attributes.sectionSticky,
                    onChange: function( content ) {
                      props.setAttributes({ sectionSticky: content })
                    }
                  }
                )
              )
            
          ),
            attributes.colAmount == 1 &&  attributes.mediaType != 'video' && el(components.PanelBody, {
              title: 'Media URLs and Links',
              className: 'text-block-count-info',
              initialOpen: true
            },
            
    
            props.attributes.mediaAmount == 2 && el('p', { style: {fontWeight: "700"}}, 'IMAGE 1'),
            el('p', {
              className: 'auto-complete-wrapper-class'
            },
              postComplete("mediaLink")
            ),
             el('p', {
              className: 'editor-bordered-input'
              },
              el( components.ToggleControl,
                {
                  label: 'Open in new Window',
                  //help:  props.attributes.mediaLinkTarget ? 'Opens Link in new Window.' : 'Open in current Window',
                  checked: props.attributes.mediaLinkTarget,
                  onChange: function( content ) {
                    props.setAttributes({ mediaLinkTarget: content })
                  }
                }
              )
            ),
            attributes.mediaAmount == 2 && el('p', {
              style:{fontWeight: "700"}}, 'IMAGE 2'),
            attributes.mediaAmount == 2 &&el('p', {
              className: 'auto-complete-wrapper-class'
            },
              postComplete("media2Link")
            ),
            attributes.mediaAmount == 2 && el('p', {
              className: 'editor-bordered-input'
              },
              el( components.ToggleControl,
                {
                  label: 'Open in new Window',
                  //help:  props.attributes.mediaLinkTarget ? 'Opens Link in new Window.' : 'Open in current Window',
                  checked: props.attributes.mediaLink2Target,
                  onChange: function( content ) {
                    props.setAttributes({ mediaLink2Target: content })
                  }
                }
              )
            )
            
            
            ),
            

          el(components.PanelBody, {
            title: 'Block One Transition',
            className: 'text-block-vertical-info',
            initialOpen: false
            },
            // buttongroup type.
            el('p', {
              className: 'text-vertical-selection'
              },

              el( SelectControl,
                {
                  className: 'item-transition-type', 
                  options : [
                    { label: 'None', value: '' },
                    { label: 'Fade In/Out', value: 'fadeInOut' },
                    { label: 'Fade In/ No Out', value: 'fadeInNoOut' },
                    { label: 'Down In / Up Out', value: 'dinUpOut' },
                    { label: 'Down In / No Out', value: 'downInNoOut' },
                    { label: 'Left In/ Right Out', value: 'linRout' },
                    { label: 'Left In / No Out', value: 'leftInNoOut' },
                    { label: 'Right In / Left Out', value: 'rightInOut' },
                    { label: 'Right In / No Out', value: 'rightInNoOut' },
                    { label: 'Up In / Down Out', value: 'upInOut' },
                    { label: 'Up In / No Out', value: 'upInNoOut' },
                    { label: 'Grow In / Small Out', value: 'growInSmallOut' },
                    { label: 'Grow In / No Out', value: 'growInNoOut' },
                  ],
                  onChange: function (newTr) {
                    props.setAttributes({ boxOnetransition: newTr }) 
                  },
                  value: props.attributes.boxOnetransition,
                }
              ),
              el( SelectControl,
                {
                  className: 'item-transition-type', 
                  options : [
                    { label: 'Default Duration', value: '' },
                    { label: '0 Sec Duration', value: '0' },
                    { label: '1/2 Sec Duration', value: '500' },
                    { label: '3/4 Sec Duration', value: '750' },
                    { label: '1 Sec Duration', value: '1000' },
                    { label: '1.5 Sec Duration', value: '1500' },
                    { label: '2 Sec Duration', value: '2000' },
                    { label: '3 Sec Duration', value: '3000' },
                  ],
                  onChange: function (newTr) {
                    props.setAttributes({ boxOnetransitionTime: newTr }) 
                  },
                  value: props.attributes.boxOnetransitionTime,
                }
              )

              ),
              el('p', {
                className: 'text-vertical-selection'
                },

                el( SelectControl,
                  {
                    className: 'item-transition-type', 
                    options : [
                      { label: 'No Delay', value: '0' },
                      { label: '1/2 Sec Delay', value: '500' },
                      { label: '3/4 Sec Delay', value: '750' },
                      { label: '1 Sec Delay', value: '1000' },
                      { label: '1.5 Sec Delay', value: '1500' },
                      { label: '2 Sec Delay', value: '2000' },
                      { label: '3 Sec Delay', value: '3000' },
                    ],
                    onChange: function (newTr) {
                      props.setAttributes({ boxOnetransitionDelay: newTr }) 
                    },
                    value: props.attributes.boxOnetransitionDelay,
                  }
                )

              ),
          ),
              
          el(components.PanelBody, {
            title: 'Block Two Transition',
            className: 'text-block-vertical-info',
            initialOpen: false
            },
            el('p', {
              className: 'text-vertical-selection'
              },

              el( SelectControl,
                {
                  className: 'item-transition-type', 
                  options : [
                    { label: 'None', value: '' },
                    { label: 'Fade In/Out', value: 'fadeInOut' },
                    { label: 'Fade In/ No Out', value: 'fadeInNoOut' },
                    { label: 'Down In / Up Out', value: 'dinUpOut' },
                    { label: 'Down In / No Out', value: 'downInNoOut' },
                    { label: 'Left In/ Right Out', value: 'linRout' },
                    { label: 'Left In / No Out', value: 'leftInNoOut' },
                    { label: 'Right In / Left Out', value: 'rightInOut' },
                    { label: 'Right In / No Out', value: 'rightInNoOut' },
                    { label: 'Up In / Down Out', value: 'upInOut' },
                    { label: 'Up In / No Out', value: 'upInNoOut' },
                    { label: 'Grow In / Small Out', value: 'growInSmallOut' },
                    { label: 'Grow In / No Out', value: 'growInNoOut' },
                  ],
                  onChange: function (newTr) {
                    props.setAttributes({ boxTwotransition: newTr }) 
                  },
                  value: props.attributes.boxTwotransition,
                }
              ),

              

              el('p', {
                className: 'text-vertical-selection'
                },

                el( SelectControl,
                  {
                    className: 'item-transition-type', 
                    options : [
                      { label: 'Default Duration', value: '' },
                      { label: '0 Sec Duration', value: '0' },
                      { label: '1/2 Sec Duration', value: '500' },
                      { label: '3/4 Sec Duration', value: '750' },
                      { label: '1 Sec Duration', value: '1000' },
                      { label: '1.5 Sec Duration', value: '1500' },
                      { label: '2 Sec Duration', value: '2000' },
                      { label: '3 Sec Duration', value: '3000' },
                    ],
                    onChange: function (newTr) {
                      props.setAttributes({ boxTwotransitionTime: newTr }) 
                    },
                    value: props.attributes.boxTwotransitionTime,
                  }
                )

              ), 
              el('p', {
                className: 'text-vertical-selection'
                },

                el( SelectControl,
                  {
                    className: 'item-transition-type', 
                    options : [
                      { label: 'No Delay', value: '0' },
                      { label: '1/2 Sec Delay', value: '500' },
                      { label: '3/4 Sec Delay', value: '750' },
                      { label: '1 Sec Delay', value: '1000' },
                      { label: '1.5 Sec Delay', value: '1500' },
                      { label: '2 Sec Delay', value: '2000' },
                      { label: '3 Sec Delay', value: '3000' },
                    ],
                    onChange: function (newTr) {
                      props.setAttributes({ boxTwotransitionDelay: newTr }) 
                    },
                    value: props.attributes.boxTwotransitionDelay,
                  }
                )

              ),

            )
          ),
            
          el(components.PanelBody, {
            title: 'Columns Type',
            className: 'text-block-count-info',
            initialOpen: false
            },
            
            el('p', {}, 'Text Only Paragraph Column?'),
              // buttongroup type.
              el('p', {},
              el('p', {
                className: 'textcol-amount-selection'
                },
                el(components.ButtonGroup, {
                  className: 'section-text-location-selection-container',
                  },
                  el(components.Button, {
                    className: props.attributes.colAmount == 1 ? 'button button-large is-primary' : 'button button-large',
                    onClick: function(e){  props.setAttributes({ colAmount: 1 }); changeMediaLocation(1); }
                    },
                    'No'
                  ),
                  el(components.Button, {
                    className: props.attributes.colAmount == 2 ? 'button button-large is-primary' : 'button button-large',
                    onClick: function(e){  props.setAttributes({ colAmount: 2, mediaAmount: 1}); changeMediaLocation(0); }
                    },
                    'Yes'
                  )
                )
              )
            )
          
          )
        ),
        //this is the default view, note not targeting any element, plain div
        el('section', { className: "page-section-panel"},
          el('div', { className: 'section-content-container', style: { textAlign: alignment } },


          el('div', { className: "editor-container-half"},
          attributes.colAmount == 1 && el('div', {
              className: 'post-part-media-container',
              //style: attributes.mediaID ? { backgroundImage: 'url(' + attributes.mediaURL + ')' } : {},
            },
           
            
            attributes.mediaType == 'video' && attributes.mediaID  &&  el('div', {
              className: attributes.mediaID ? 'section-content-media-container has-media' : 'section-content-media-container no-media',
              //style: { width: "100%", height: "200px"  },
              //value: "has Video"
              },
              el ('video', {
                controls: true, src: attributes.mediaURL,
                style: { height: "180px", width: "320px"}
              }),
              el('div', {
                className: 'video-captions'
                },
                el(MediaUpload, {
                  onSelect: onSelectCaption,
                  type: 'image',
                  value: attributes.mediaCaptionID,
                  render: function (obj) {
                    return el(components.Button, {
                        className: attributes.mediaCaptionID ? 'image-button button button-large' : 'button button-large  is-primary',
                        onClick: obj.open
                      },
                      !attributes.mediaCaptionID ? 'add caption file' : 'change caption file'
                      )
                    }
                  }),
                  el(RichText,{
                  value: attributes.mediaCaptionURL,
                  tag: "span",
                  style: {fontSize: '14px'}
                  })
              ),
              el('div', {
                className: 'video-timings'
                },
                
                el(TextControl, {
                  tagName: 'span',
                  placeholder: 'Start',
                  style: {"font-size": "20px", width: "60px", height: "40px", padding: "5px", display: "inline-block"},
                  keepPlaceholderOnFocus: true,
                  value: attributes.mediaStart,
                  onChange: function (newStart) {
                      var startItem = newStart.replace(/[^0-9// ]/g, "");
                      props.setAttributes({ mediaStart: startItem })
                    },
                  }),
                
                  el(TextControl, {
                    tagName: 'span',
                    placeholder: 'End',
                    style: {"font-size": "20px", width: "60px", height: "40px", padding: "5px", display: "inline-block"},
                    keepPlaceholderOnFocus: true,
                    value: attributes.mediaEnd,
                    onChange: function (newE) {
                        var startItem = newE.replace(/[^0-9// ]/g, "");
                        props.setAttributes({ mediaEnd: startItem })
                      },
                    }),
              ),
              el('div', {
                className: 'video-poster'
                },
                el(MediaUpload, {
                  onSelect: onSelectPoster,
                  value: attributes.mediaPosterURL,
                  type: 'image',
                  render: function (obj) {
                    return el(components.Button, {
                        className: attributes.mediaPosterURL ? 'image-button button button-large' : 'button button-large  is-primary',
                        onClick: obj.open
                      },
                      !attributes.mediaPosterURL ? 'add screenshot' : 'change screenshot'
                      )
                    }
                  }),
                  el(RichText,{
                  value: attributes.mediaPosterURL,
                  tag: "span",
                  style: {fontSize: '12px'}
                  })
              )
            ),
            
            attributes.mediaType != 'video' && attributes.mediaID  &&  el('div', {
              style: { backgroundImage: 'url(' + attributes.mediaURL + ')', width: "100%", height: "200px",  marginBottom:"20px", backgroundSize: "contain", backgroundRepeat: "no-repeat" }
            }),
            el(MediaUpload, {
              onSelect: onSelectImage,
              type: 'image',
              value: attributes.mediaID,
              render: function (obj) {
                return el(components.Button, {
                    className: attributes.mediaID ? 'image-button button ' : 'button button-large',
                    onClick: obj.open
                  },
                  !attributes.mediaID ? 'choose primary photo or video' : 'change primary '+ attributes.mediaType
                  )
                }
              }),


              
            ),
          ),

          el('div', { className: "editor-container-half"},
            attributes.mediaAmount == 2 && props.attributes.mediaAmount == 2 && el('div', {
              className: 'post-part-media-container',
                //style: attributes.mediaID ? { backgroundImage: 'url(' + attributes.mediaURL + ')' } : {},
              },
              attributes.mediaType == 'video' && attributes.media2ID  &&  el('div', {
                className: attributes.media2ID ? 'section-content-media-container has-media' : 'section-content-media-container no-media',
                style: { width: "100%", height: "200px"  },
                value: "has Video"
                },
                el ('video', {
                  controls: true, src: attributes.media2URL,
                  style: { maxHeight: "200px", width: "auto"}
                })
              ),
              attributes.mediaType != 'video' && attributes.media2ID  &&  el('div', {
                style: { backgroundImage: 'url(' + attributes.media2URL + ')', width: "100%", height: "200px", backgroundSize: "contain", backgroundRepeat: "no-repeat" }
              }),
              el(MediaUpload, {
                onSelect: onSelectImage2,
                type: 'image',
                value: attributes.media2ID,
                render: function (obj) {
                  return el(components.Button, {
                      className: attributes.media2ID ? 'image-button button ' : 'button button-large',
                      onClick: obj.open
                    },
                    !attributes.media2ID ? 'choose secondary photo or video' : 'change secondary '+ attributes.mediaType
                    )
                  }
                }),
            ),
          ),

          el('div', { className: attributes.colAmount == 2 ? "editor-container-half" : "",
                style: {
                  display: attributes.mediaAmount == 1 ? "inline-block" : "none",
                  width:  attributes.colAmount == 2 ? "50%" : "100%"
                }
          },
            el( InnerBlocks, {
                  allowedBlocks:  REVEAL_ALLOWED_BLOCKS
                }
              ),
          ),
          el('div', { className:    "editor-container-half" },
              attributes.colAmount == 2 &&  attributes.mediaAmount == 1 && el( editor.RichText, {
                multiline: "p",
                tagName: 'div',   
                className: 'section-content-body-text',  
                value: attributes.body,  
                allowedFormats: [ 'core/bold', 'core/link', 'core/italic' ],
                onChange: function( content ) {
                    // if(content["0"].props.children.length < 1){ 
                    //   props.setAttributes( { hasBody: false } );
                    // } else{
                    //   props.setAttributes( { hasBody: true } );
                    // }
                    props.setAttributes( { body: content } ); 
                },
                placeholder: 'Simple Text content (extra paragraph text) here', 
              } )
            ),
            el('div', { className: "editor-container-clearfix"})
          )
        )
      ]
    }),
    save: function(props) {
      var timeString = "#t=" + props.attributes.mediaStart + "," + props.attributes.mediaEnd
      const mediaTypeRenders = {
        image: function() { 
          if(attributes.mediaLink){
            return el('a', {
              href: props.attributes.mediaLink,
              target: props.attributes.mediaLinkTarget ? "_blank" : false
            }, 
              el( 'img',  {
              src:  attributes.mediaURL,  
              alt:  attributes.mediaAlt, 
              className:  attributes.mediaId && attributes.mediaType === 'image'
              ? 'wp-image-' + attributes.mediaId
              : ''}
              )
            );
          } else{
            return el( 'img',  {
              src:  attributes.mediaURL,  
              alt:  attributes.mediaAlt, 
              className:  attributes.mediaId && attributes.mediaType === 'image'
              ? 'wp-image-' + attributes.mediaId
              : ''}
             );
          }
       
          },
        video: function(){ return el ('video', {
            controls: true, src: (props.attributes.mediaStart || props.attributes.mediaEnd) ? attributes.mediaURL + timeString : attributes.mediaURL,
            poster:  attributes.mediaPosterURL ? attributes.mediaPosterURL : false
          },
          attributes.mediaCaptionID && el('track', {
            kind: 'subtitles',
            src: attributes.mediaCaptionURL, 
            srclang: "en",
            id: "subtitle-"+attributes.mediaCaptionID,
            label: "English",
            default: true
          })
          )
        },
      };
      constMediaBox = function(){
        return el('div', {
          className: attributes.mediaType === 'image' ? 'primary-media-item post-part-media image' : 'primary-media-item post-part-media video',
            },
          el('div', { className: "mgb" },
          attributes.mediaType === 'image' && el('figure', { className: "wp-media-container container-type-"+ attributes.mediaType, 
            itemscope: true,
            itemprop: "image",
            itemtype: "https://schema.org/ImageObject" },
            ( mediaTypeRenders[ attributes.mediaType ] || function(){return false;})(),
              el('meta', {
                itemprop: "width",
                content: "1200"
                }
              ),
              el('meta', {
                itemprop: "height",
                content: "1200"
                }
              ),
              el('meta', {
                itemprop: "url",
                content: attributes.mediaURL
                }
              )
            ),
            
            attributes.mediaType != 'image' &&  el('figure', { className: "wp-media-container container-type-"+ attributes.mediaType,
            itemscope: true,
            itemprop: "video",
            itemtype: "https://schema.org/VideoObject" ,
            "data-media-cut-out": attributes.sectionMediaEnd ? attributes.sectionMediaEnd : false,
            "data-media-cut-in": attributes.sectionMediaStart ? attributes.sectionMediaStart : false, },
            ( mediaTypeRenders[ attributes.mediaType ] || function(){return false;})(),
              el('meta', {
                itemprop: "contentUrl",
                content: attributes.mediaURL
               }),
              el('meta', {
                itemprop: "thumbnailUrl",
                content: attributes.mediaPosterURL
                }),
              el('meta', {
                itemprop: "uploadDate",
                content: attributes.mediaDate
                }),
                attributes.mediaDuration && el('meta', {
                  itemprop: "duration",
                  content: attributes.mediaDuration
                }),

                attributes.body != "" && el('meta', {
                  itemprop: "description",
                  content: (function(){ 
                    var stringIt = "";
                    for (var key in attributes.body) {
                      stringIt =  stringIt + attributes.body[key].props.children.join(" ");
                    }
                    return stringIt;
                  })()
                })

            )
            
          )
        )
      }
      var attributes = props.attributes;
      return (
        el('section', {
            className: 'post-part basic-part'
            },
            el('div', {
              className: ('post-part-vertical-align') + (attributes.sectionSticky ? "  sticky": ""),
            },
              el('div', {
                className: 'align-inner',
              },
                el('div', {
                  className: ('post-part-container ') + (attributes.sectionMediaLocation == 1 && attributes.mediaAmount == 1 &&  attributes.mediaID? 'left-media ': '') + (attributes.sectionMediaLocation == 2  && attributes.mediaAmount == 1 &&  attributes.mediaID? 'right-media ' : '') + (attributes.hasNestedBlocks ? ' has-content ' : '') + (attributes.mediaAmount == 2 ? ' all-media-content ' : '') + (attributes.colAmount == 2 ? 'two-col-text ' : ''),
                },
                el('div', { 
                  className: "content-wrap" 
                  },
                  attributes.mediaID && attributes.sectionMediaLocation == 1 && el('div',  { className: ("lyt") + (attributes.boxOnetransition ? " bxTr "+attributes.boxOnetransition : "") ,
                  "data-box-transition-delay": attributes.boxOnetransitionDelay,
                  style: attributes.boxOnetransitionTime && attributes.boxOnetransition ? {
                    "transition-duration": attributes.boxOnetransitionTime/1000+ "s;" } : {},
                  "data-box-transition-duration": attributes.boxOnetransitionTime,
                  "data-box-transition": attributes.boxOnetransition},
                    constMediaBox()
                  ),
                  //props.innerBlocks && props.innerBlocks.length > 0 && 
                  ((attributes.mediaAmount == 1 && attributes.hasNestedBlocks) || (attributes.colAmount == 2)) && el('div', { className: ("lyt") + (attributes.boxTwotransition ? " bxTr "+attributes.boxTwotransition : ""),
                  style: attributes.boxTwotransitionTime && attributes.boxTwotransition ? {
                    "transition-duration": attributes.boxTwotransitionTime/1000+ "s;" } : {},
                  "data-box-transition-delay": attributes.boxTwotransitionDelay,
                  "data-box-transition-duration": attributes.boxTwotransitionTime,
                  "data-box-transition": attributes.boxTwotransition },
                    el('div',  {
                      className: attributes.colAmount == 2 ? 'post-part-spacer' : 'post-part-block-content text-align-'+ attributes.alignment,
                    },
                      el('div', {className: "cxb"},
                        el( InnerBlocks.Content)
                      )
                    ),
                  ),
                  attributes.colAmount == 2 && el('div',  { className: ("lyt") + (attributes.boxOnetransition ? " bxTr "+attributes.boxOnetransition : "") ,
                  "data-box-transition-delay": attributes.boxOnetransitionDelay,
                  style: attributes.boxOnetransitionTime && attributes.boxOnetransition ? {
                    "transition-duration": attributes.boxOnetransitionTime/1000+ "s;" } : {},
                  "data-box-transition-duration": attributes.boxOnetransitionTime,
                  "data-box-transition": attributes.boxOnetransition},
                    el('div',  {
                        className: 'post-part-block-content text-align-'+ attributes.alignment,
                      },
                      el('div', {className: "cxb"},
                        el( RichText.Content, {
                          tagName: 'div',
                          multiline: "p",
                          className: 'section-content-body-text',
                          value: attributes.body,
                          itemprop: "text", 
                        } )
                      )
                    )
                  ),
                  attributes.mediaAmount == 2 && el('div',  { className: ("lyt") + (attributes.boxTwotransition ? " bxTr "+attributes.boxTwotransition : ""),
                  style: attributes.boxTwotransitionTime && attributes.boxTwotransition ? {
                    "transition-duration": attributes.boxTwotransitionTime/1000+ "s;" } : {},
                  "data-box-transition-delay": attributes.boxTwotransitionDelay,
                  "data-box-transition-duration": attributes.boxTwotransitionTime,
                  "data-box-transition": attributes.boxTwotransition},
                    el('div', {
                      className: 'post-part-media image',
                      },
                      el('div',  { className: "mgb" },
                        el('figure', { className: "wp-media-container container-type-"+ attributes.mediaType },
                          attributes.media2Link == "" && el( 'img',  {
                            src:  attributes.media2URL,  
                            alt:  attributes.media2Alt, 
                            className:  attributes.media2Id && attributes.mediaType === 'image'
                            ? 'wp-image-' + attributes.media2Id
                            : ''}
                          ),
                          attributes.media2Link != "" && el('a', {
                            href: props.attributes.media2Link,
                            target: props.attributes.media2LinkTarget ? "_blank" : false
                            }, 
                            el( 'img',  {
                              src:  attributes.media2URL,  
                              alt:  attributes.media2Alt, 
                              className:  attributes.media2Id && attributes.mediaType === 'image'
                              ? 'wp-image-' + attributes.media2Id
                              : ''}
                            )
                          )
                        )
                      )
                    )
                  ),
                  attributes.mediaID && attributes.sectionMediaLocation == 2 && el('div',{ className: ("lyt") + (attributes.boxOnetransition ? " bxTr "+attributes.boxOnetransition : "") ,
                          "data-box-transition-delay": attributes.boxOnetransitionDelay,
                          style: attributes.boxOnetransitionTime && attributes.boxOnetransition ? {
                            "transition-duration": attributes.boxOnetransitionTime/1000+ "s;" } : {},
                          "data-box-transition-duration": attributes.boxOnetransitionTime,
                          "data-box-transition": attributes.boxOnetransition},
                    constMediaBox()
                  ),
                  )
                )
              )
          )
        )
      );
    },
} );


  blocks.registerBlockType( 'mhbasictheme-layout/image-part', {
      title: 'Contet Overlay / Cover Panel',
      icon: 'slides',
      supports: {  anchor: true },
      category: 'common',
      className: "image-part post-part",
      example: {},
      attributes: { // Necessary for saving block content.
        author: {
          type: 'string',
          source: 'meta',
          meta: 'author'
        },
        mediaType: {
          type: 'string',
          default: 'image'
        },
        sectionTextLocation: {
          type: 'string',
          default: 'center'
        },
        sectionIsCover: {
          type: 'bool',
          default: false
        },
        sectionIsFullWidth: {
          type: 'bool',
          default: false
        },
        mediaID: {
          type: 'number'
        },
        mediaAlt: {
          type: 'string'
        },
        mediaSizes: {
          type: 'object'
        },
        mediaURL: {
          type: 'string',
        },
        boxTwotransition: {
          type: 'string',
        },
        boxOnetransition: {
          type: 'string',
        },
        boxTwotransitionTime: {
          type: 'number'
        },
        boxOnetransitionTime: {
          type: 'number'
        },
        boxTwotransitionDelay: {
          type: 'number',
        },
        boxOnetransitionDelay: {
          type: 'number',
        },
        alignment: {
          type: 'string',
          default: 'center'
        },
        sectionSticky: {
          type: 'bool',
          default: false
        }
      },
      edit: function(props) {
        var attributes = props.attributes
        var alignment = props.attributes.alignment

        var onSelectImage = function(media) {
          var mediaUrl = media.url;
          if(media.sizes){
            if(media.sizes['mhbasictheme-fullscreen'] && media.sizes['mhbasictheme-fullscreen']['url']){
              mediaUrl = media.sizes['mhbasictheme-fullscreen'] ['url'];
            } else{
              mediaUrl = media.sizes['full'] ['url'];
            }
          }

          return props.setAttributes({
            mediaURL: makeImageRelative(mediaUrl),
            mediaID: media.id,
            mediaAlt: media.alt,
            mediaSizes: media.sizes ? media.sizes : null,
            mediaType: media.type
          })
        }

        
        function changeTextLocation (newAlignment) {
          props.setAttributes({ sectionTextLocation: newAlignment })
        }
        function onChangeAlignment (newAlignment) {
          props.setAttributes({ alignment: newAlignment })
        }
    
          return [el(BlockControls, { key: 'controls' }, // Display controls when the block is clicked on.
            el('div', { className: 'components-toolbar' },
              el(MediaUpload, {
                onSelect: onSelectImage,
                type: 'image',
                render: function (obj) {
                  return el(components.Button, {
                    className: 'components-icon-button components-toolbar__control',
                    onClick: obj.open
                  },
                  // Add Dashicon for media upload button.
                  el('svg', { className: 'dashicon dashicons-edit', width: '20', height: '20' },
                    el('path', { d: 'M2.25 1h15.5c.69 0 1.25.56 1.25 1.25v15.5c0 .69-.56 1.25-1.25 1.25H2.25C1.56 19 1 18.44 1 17.75V2.25C1 1.56 1.56 1 2.25 1zM17 17V3H3v14h14zM10 6c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm3 5s0-6 3-6v10c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V8c2 0 3 4 3 4s1-3 3-3 3 2 3 2z' })
                  ))
                }
              })
            ),
            // Display alignment toolbar within block controls.
            el(AlignmentToolbar, {
              value: alignment,
              onChange: onChangeAlignment
            })
          ),
          //sidebar controls here
          el(InspectorControls, { key: 'inspector' }, // Display the block options in the inspector panel.
            //none yet
            el(components.PanelBody, {
              title: 'Options and Configuration',
              className: 'image-block-count-info',
              initialOpen: true
            },
              el('p', {}, 'Section Focus'),
              el('p', {
                className: 'editor-bordered-input'
                },
                el( components.ToggleControl,
                  {
                    label: 'section is sticky',
                    //help:  props.attributes.mediaLinkTarget ? 'Opens Link in new Window.' : 'Open in current Window',
                    checked: props.attributes.sectionSticky,
                    onChange: function( content ) {
                      props.setAttributes({ sectionSticky: content })
                    }
                  }
                )
              )
            
          ),
            el(components.PanelBody, {
              title: 'Overlay  Options',
              className: 'text-block-vertical-info',
              initialOpen: true
            },
            el('p', {}, 'Stretch To Screen Width?'),
            // buttongroup type.
            el('p', {},
            el('p', {
              className: 'text-vertical-selection'
              },
              el(components.ButtonGroup, {
                className: 'section-text-location-selection-container',
                },
                el(components.Button, {
                  className: props.attributes.sectionIsFullWidth ? 'button button-large is-primary' : 'button button-large',
                  onClick: function(e){  props.setAttributes({ sectionIsFullWidth: true }) }
                  },
                  'Yes'
                ),
                el(components.Button, {
                  className: props.attributes.sectionIsFullWidth != true ? 'button button-large is-primary' : 'button button-large',
                  onClick: function(e){  props.setAttributes({ sectionIsFullWidth: false }) }
                  },
                  'No'
                  )
                )
              )

            ),
            el('p', {}, 'Stretch to Screeen Height?'),
            // buttongroup type.
            el('p', {},
            el('p', {
              className: 'text-vertical-selection'
              },
              el(components.ButtonGroup, {
                className: 'section-text-location-selection-container',
                },
                el(components.Button, {
                  className: props.attributes.sectionIsCover ? 'button button-large is-primary' : 'button button-large',
                  onClick: function(e){  props.setAttributes({ sectionIsCover: true }) }
                  },
                  'Yes'
                ),
                el(components.Button, {
                  className: props.attributes.sectionIsCover != true ? 'button button-large is-primary' : 'button button-large',
                  onClick: function(e){  props.setAttributes({ sectionIsCover: false }) }
                  },
                  'No'
                  )
                )
              )

            ),
            
            props.attributes.sectionIsCover  && el('p', {}, 'Text Vertical Position'),
              // buttongroup type.
              props.attributes.sectionIsCover  && el('p', {},
              props.attributes.sectionIsCover  && el('p', {
                className: 'text-vertical-selection'
                },
                el(components.ButtonGroup, {
                  className: 'section-ttext-location-selection-container',
                  },
                  el(components.Button, {
                    className: props.attributes.sectionTextLocation == 'top' ? 'button button-large is-primary' : 'button button-large',
                    onClick: function(e){ changeTextLocation('top'); }
                    },
                    'Top'
                  ),
                  el(components.Button, {
                    className: props.attributes.sectionTextLocation ==  'center' ? 'button button-large is-primary' : 'button button-large',
                    onClick: function(e){ changeTextLocation('center'); }
                    },
                    'Center'
                  ),
                  el(components.Button, {
                    className: props.attributes.sectionTextLocation == 'bottom' ? 'button button-large is-primary' : 'button button-large',
                      onClick: function(e){ changeTextLocation('bottom'); }
                    },
                    'Bottom'
                  )
                )
              )
            )
            
            ),

            
            el(components.PanelBody, {
              title: 'Background Transition',
              className: 'text-block-vertical-info',
              initialOpen: false
              },
              // buttongroup type.
              el('p', {
                className: 'text-vertical-selection'
                },

                el( SelectControl,
                  {
                    className: 'item-transition-type', 
                    options : [
                      { label: 'None', value: '' },
                      { label: 'Fade In/Out', value: 'fadeInOut' },
                      { label: 'Fade In/ No Out', value: 'fadeInNoOut' },
                      { label: 'Down In / Up Out', value: 'dinUpOut' },
                      { label: 'Down In / No Out', value: 'downInNoOut' },
                      { label: 'Left In/ Right Out', value: 'linRout' },
                      { label: 'Left In / No Out', value: 'leftInNoOut' },
                      { label: 'Right In / Left Out', value: 'rightInOut' },
                      { label: 'Right In / No Out', value: 'rightInNoOut' },
                      { label: 'Up In / Down Out', value: 'upInOut' },
                      { label: 'Up In / No Out', value: 'upInNoOut' },
                    ],
                    onChange: function (newTr) {
                      props.setAttributes({ boxOnetransition: newTr }) 
                    },
                    value: props.attributes.boxOnetransition,
                  }
                ),
                el( SelectControl,
                  {
                    className: 'item-transition-type', 
                    options : [
                      { label: 'Default Duration', value: '' },
                      { label: '0 Sec Duration', value: '0' },
                      { label: '1/2 Sec Duration', value: '500' },
                      { label: '3/4 Sec Duration', value: '750' },
                      { label: '1 Sec Duration', value: '1000' },
                      { label: '1.5 Sec Duration', value: '1500' },
                      { label: '2 Sec Duration', value: '2000' },
                      { label: '3 Sec Duration', value: '3000' },
                    ],
                    onChange: function (newTr) {
                      props.setAttributes({ boxOnetransitionTime: newTr }) 
                    },
                    value: props.attributes.boxOnetransitionTime,
                  }
                )

                ),
                el('p', {
                  className: 'text-vertical-selection'
                  },

                  el( SelectControl,
                    {
                      className: 'item-transition-type', 
                      options : [
                        { label: 'No Delay', value: '0' },
                        { label: '1/2 Sec Delay', value: '500' },
                        { label: '3/4 Sec Delay', value: '750' },
                        { label: '1 Sec Delay', value: '1000' },
                        { label: '1.5 Sec Delay', value: '1500' },
                        { label: '2 Sec Delay', value: '2000' },
                        { label: '3 Sec Delay', value: '3000' },
                      ],
                      onChange: function (newTr) {
                        props.setAttributes({ boxOnetransitionDelay: newTr }) 
                      },
                      value: props.attributes.boxOnetransitionDelay,
                    }
                  )

                ),
            ),
                
            el(components.PanelBody, {
              title: 'Overlay Transition',
              className: 'text-block-vertical-info',
              initialOpen: false
              },
              el('p', {
                className: 'text-vertical-selection'
                },

                el( SelectControl,
                  {
                    className: 'item-transition-type', 
                    options : [
                      { label: 'None', value: '' },
                      { label: 'Fade In/Out', value: 'fadeInOut' },
                      { label: 'Fade In/ No Out', value: 'fadeInNoOut' },
                      { label: 'Down In / Up Out', value: 'dinUpOut' },
                      { label: 'Down In / No Out', value: 'downInNoOut' },
                      { label: 'Left In/ Right Out', value: 'linRout' },
                      { label: 'Left In / No Out', value: 'leftInNoOut' },
                      { label: 'Right In / Left Out', value: 'rightInOut' },
                      { label: 'Right In / No Out', value: 'rightInNoOut' },
                      { label: 'Up In / Down Out', value: 'upInOut' },
                      { label: 'Up In / No Out', value: 'upInNoOut' },
                      { label: 'Grow In / Small Out', value: 'growInSmallOut' },
                      { label: 'Grow In / No Out', value: 'growInNoOut' },
                    ],
                    onChange: function (newTr) {
                      props.setAttributes({ boxTwotransition: newTr }) 
                    },
                    value: props.attributes.boxTwotransition,
                  }
                ),

                

                el('p', {
                  className: 'text-vertical-selection'
                  },

                  el( SelectControl,
                    {
                      className: 'item-transition-type', 
                      options : [
                        { label: 'Default Duration', value: '' },
                        { label: '0 Sec Duration', value: '0' },
                        { label: '1/2 Sec Duration', value: '500' },
                        { label: '3/4 Sec Duration', value: '750' },
                        { label: '1 Sec Duration', value: '1000' },
                        { label: '1.5 Sec Duration', value: '1500' },
                        { label: '2 Sec Duration', value: '2000' },
                        { label: '3 Sec Duration', value: '3000' },
                      ],
                      onChange: function (newTr) {
                        props.setAttributes({ boxTwotransitionTime: newTr }) 
                      },
                      value: props.attributes.boxTwotransitionTime,
                    }
                  )

                ), 
                el('p', {
                  className: 'text-vertical-selection'
                  },

                  el( SelectControl,
                    {
                      className: 'item-transition-type', 
                      options : [
                        { label: 'No Delay', value: '0' },
                        { label: '1/2 Sec Delay', value: '500' },
                        { label: '3/4 Sec Delay', value: '750' },
                        { label: '1 Sec Delay', value: '1000' },
                        { label: '1.5 Sec Delay', value: '1500' },
                        { label: '2 Sec Delay', value: '2000' },
                        { label: '3 Sec Delay', value: '3000' },
                      ],
                      onChange: function (newTr) {
                        props.setAttributes({ boxTwotransitionDelay: newTr }) 
                      },
                      value: props.attributes.boxTwotransitionDelay,
                    }
                  )

                ),

              )
            )
          ),
          
          //this is the default view, note not targeting any element, plain div
          el('section', { className: "page-section-panel"},
            el('div', {   className: 'post-part'},
              el('div', {   className: attributes.mediaID ? 'post-part-container has-media' : 'post-part-container no-media ', style: { textAlign: alignment } },
                el('div', {
                  className: 'post-part-media-container',
                  //style: attributes.mediaID ? { backgroundImage: 'url(' + attributes.mediaURL + ')' } : {},
                },
                attributes.mediaType == 'video' && attributes.mediaID  &&  el('div', {
                  className: attributes.mediaID ? 'section-content-media-container has-media' : 'section-content-media-container no-media',
                  style: { width: "100%", height: "200px"  },
                  value: "has Video"
                  },
                  el ('video', {
                    controls: true, src: attributes.mediaURL,
                    style: { maxHeight: "200px", width: "auto"}
                  })
                ),
                attributes.mediaType != 'video' && attributes.mediaID  &&  el('div', {
                  style: { backgroundImage: 'url(' + attributes.mediaURL + ')', width: "100%", height: "200px", backgroundSize: "contain", backgroundRepeat: "no-repeat" }
                }),
                el(MediaUpload, {
                  onSelect: onSelectImage,
                  type: 'image',
                  value: attributes.mediaID,
                  render: function (obj) {
                    return el(components.Button, {
                        className: attributes.mediaID ? 'image-button button ' : 'button button-large',
                        onClick: obj.open
                      },
                      !attributes.mediaID ? 'choose background media' : 'change backgroud '+ attributes.mediaType
                      )
                    }
                  }),
                
                ),
                el( InnerBlocks, {
                    allowedBlocks:  ['core/heading', 'core/pullquote', 'core/file', 'core/button']
                    // allowedBlocks:  REVEAL_ALLOWED_BLOCKS
                  }
                )
              )
            )
          )
        ]
      },
      save: function(props) {
        const mediaTypeRenders = {
          image: function() { 
            return el( 'img',  {
              src:  attributes.mediaURL,  
              alt:  attributes.mediaAlt, 
              className:  attributes.mediaId && attributes.mediaType === 'image'
              ? 'wp-image-' + attributes.mediaId
              : ''}
             );
            },
          video: function(){ return el ('video', {
            controls: true, src: attributes.mediaURL,
            autoplay: "on",
            muted: true,
            loop: true
            })
          },
        };

        var attributes = props.attributes

        //console.log("innblocks", InnerBlocks().length);
        return (
            el('section', {

                className:  'post-part fullwidth-image-part' 
                },


              el( 'div', {
                className: ('post-part-vertical-align') + (attributes.sectionSticky ? "  sticky": ""),
              },
                el('div', {
                  className: 'align-inner',
                },
                  attributes.mediaID && el('div', {
                            className: ('post-part-block-background has-'+ attributes.mediaType) + (attributes.boxOnetransition ? " bxTr "+attributes.boxOnetransition : "") + (attributes.sectionIsFullWidth ? ' fill-screen-width': '') + (attributes.sectionIsCover ? ' fill-screen-height': ''),
                            "data-box-transition-delay": attributes.boxOnetransitionDelay,
                            style: attributes.boxOnetransitionTime && attributes.boxOnetransition ? {
                              "transition-duration": attributes.boxOnetransitionTime/1000+ "s;" } : {},
                            "data-box-transition-duration": attributes.boxOnetransitionTime,
                            "data-box-transition": attributes.boxOnetransition,
                        },
                        el('figure', { className: "wp-media-container container-type-"+ attributes.mediaType },
                        ( mediaTypeRenders[ attributes.mediaType ] || function(){return false;})()
                        )
                    ),

            
                      
                  el('div', {
                      className: (attributes.mediaID > 0 ? 'post-part-container has-'+ attributes.mediaType : 'post-part-container') + (attributes.sectionIsCover ? ' section-part-cover': '') + (attributes.boxTwotransition ? " bxTr "+attributes.boxTwotransition : ""),
                      style: attributes.boxTwotransitionTime && attributes.boxTwotransition ? {
                        "transition-duration": attributes.boxTwotransitionTime/1000+ "s;" } : {},
                      "data-box-transition-delay": attributes.boxTwotransitionDelay,
                      "data-box-transition-duration": attributes.boxTwotransitionTime,
                      "data-box-transition": attributes.boxTwotransition
                    },
                    el('div', { 
                      className: "content-wrap" 
                      },
                      el('div', { className: "lyt "},
                          attributes.sectionTextLocation == 'bottom' &&  el('div', {className: "top-padd-content"}),
                          el('div', { className: 'post-part-block-content text-align-'+ attributes.alignment + ' vertical-position-' + attributes.sectionTextLocation },
                          el('div', {className: "txb"},
                            el( InnerBlocks.Content)
                          )
                        ),
                      ),
                    ),
                  )
                )
              )
          )
        );
      },
  } );
}(
  window.wp.blocks,
  window.wp.blockEditor,
  window.wp.components,
  window.wp.element,
  window.wp.hooks,
  window.wp.data
  //window.wp.i18n,
) );
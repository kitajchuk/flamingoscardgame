import $ from "properjs-hobo";
import * as core from "../core";



// Singleton
let _instance = null;



/**
 *
 * @public
 * @global
 * @class ContactController
 * @classdesc Handle contact form posting — hooked into Squarespace integration.
 *
 */
class ContactController {
    constructor () {
        if ( !_instance ) {
            this.element = core.dom.contact;
            this.form = this.element.find( ".js-contact-form" );
            this.fields = this.element.find( ".js-contact-field" );
            this.submit = this.element.find( ".js-contact-submit" );
            this.data = {};

            this.bind();

            _instance = this;
        }

        return _instance;
    }


    bind () {
        this.submit.on( "click", () => {
            this.gather();
            this.send();
        });
    }


    clear () {
        this.data = {};
        this.fields.removeClass( "is-error" ).forEach(( el ) => {
            if ( /^select/.exec( el.name ) ) {
                el.selectedIndex = 0;

            } else {
                el.value = "";
            }
        });
    }


    reset () {
        this.element.removeClass( "is-success" );
    }


    getKey () {
        return $.ajax({
            url: "/api/form/FormSubmissionKey",
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: "json"
        });
    }


    /*{
        {
            "name-yui_3_17_2_1_1543786088059_1886":["",""],
            "email-yui_3_17_2_1_1543786088059_1887":"",
            "text-yui_3_17_2_1_1543786088059_1888":"",
            "textarea-yui_3_17_2_1_1543786088059_1889":""
        }
    }*/
    saveForm ( key ) {
        return $.ajax({
            url: "/api/form/SaveFormSubmission",
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: "json",
            payload: {
                collectionId: "5c044e66562fa76e5e836cab",
                form: JSON.stringify( this.data ),
                formId: "5c044e7a758d469484889bd2",
                key,
                objectName: "page-5c044e66562fa76e5e836cab",
                pageId: "5c044e66562fa76e5e836cab",
                pagePath: "/contact/",
                pageTitle: "Contact"
            }
        });
    }


    gather () {
        this.data = {};
        this.fields.forEach(( el ) => {
            if ( /^phone/.test( el.name ) ) {
                // Sanitize all non-digit characters from the value
                // EG: (555) 555-5555 becomes 5555555555
                const phone = el.value.replace( /\D/g, "" );

                // This will handle US phone numbers fairly well...
                this.data[ el.name ] = [
                    phone.slice( 0, phone.length - 10 ),
                    phone.slice( phone.length - 10, phone.length - 7 ),
                    phone.slice( phone.length - 7, phone.length - 4 ),
                    phone.slice( phone.length - 4, phone.length )
                ];

            } else if ( /^name/.test( el.name ) ) {
                this.data[ el.name ] = el.name.split( " " );

            } else {
                this.data[ el.name ] = el.value;
            }
        });
    }


    handle ( response ) {
        if ( response && response.errors ) {
            for ( const i in response.errors ) {
                if ( response.errors.hasOwnProperty( i ) ) {
                    this.fields.filter( `[name='${i}']` ).addClass( "is-error" );
                }
            }

        } else {
            this.element.addClass( "is-success" );
            this.clear();
        }
    }


    send () {
        this.fields.removeClass( "is-error" );
        this.getKey().then(( json ) => {
            this.saveForm( json.key ).then(( response ) => {
                this.handle( response );

            }).catch(( response ) => {
                this.handle( response );
            });

        }).catch(() => {
            // Error?
        });
    }


    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default ContactController;

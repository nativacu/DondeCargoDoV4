import { Component, NgModule } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Generated class for the ValidatorsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 // The Angular email validator accepts an email like "rob@example", perhaps because "rob@localhost" could be valid.
// The pureEmail regex does not accept "ryan@example" as a valid email address, which I think is a good thing.
// See: EMAIL_REGEXP from https://github.com/angular/angular.js/blob/ffb6b2fb56d9ffcb051284965dd538629ea9687a/src/ng/directive/input.js#L16
const PURE_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Passwords should be at least 8 characters long and should contain one number, one character and one special character.
const PASSWORD_REGEXP = /^([a-zA-Z\-0-9\d@$!%*#?&]{6,})$/;

const PHONENUM_REGEXP =  /^(809|829|849)([0-9]{7})$/;

const ID_REGEXP =  /^([0-9]{11})$/;

export const regexValidators = {
  email: PURE_EMAIL_REGEXP,
  password: PASSWORD_REGEXP,
  phone_number: PHONENUM_REGEXP,
  id: ID_REGEXP

};

@Component({
  selector: 'page-validators',
})

export class uniqueIdValidator {
  static uniqueID(control: AbstractControl): ValidationErrors | null {
    const ced: string = control.value;
    if (ced.length !== 11) {
      return { isAnId: false };
    }
    let ver: any = 0;
    let dig: any = 0;
    const digver: any = +ced.charAt(10);
    let even: any = 0, odd: any = 0;
    for (let x: any = 9; x >= 0; x--) {
      dig = +ced.charAt(x);
      if (x & 1) {
        odd += (2 * dig) % 10 + +(((2 * dig) / 10) >= 1);
      } else {
        even += dig;
      }
    }
    console.log(even);
    console.log(odd);
    ver = 10 - (even + odd) % 10;
    console.log(ver);
    if ((ver === 10 && digver === 0) || ver === digver) {
      return null;
    }
    return { isAnId: false };
  }
}

export class ValidatorsPage {


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ValidatorsPage');
  }

}

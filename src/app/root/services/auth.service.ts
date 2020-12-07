import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {User} from '../models/user.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.setAuthenticatedUserStream();
  }

  private setAuthenticatedUserStream(): void {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        return user ? this.afs.doc<User>(`users/${user.uid}`).valueChanges() : of(null);
      })
    );
  }

  async googleSignin(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credentials = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credentials.user).then(res => {
      const redirectTo = this.activatedRoute.snapshot.queryParams?.return;
      this.router.navigate([redirectTo || '']);
    });
  }

  private updateUserData({uid, email, displayName, photoURL}): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);
    const data: User = {uid, email, displayName, photoURL};
    return userRef.set(data, {merge: true});
  }

  signOut(): void {
    this.afAuth.signOut().then(res => {
        this.router.navigate(['/auth']);
      }
    ).catch(error => {
      console.log('There was an error logging out');
    });
  }
}

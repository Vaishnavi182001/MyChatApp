import { CommentsComponent } from "../components/comments/comments.component";
import { StreamsComponent } from "../components/streams/streams.component";
import { NgModule } from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import { AuthGuard } from "../services/auth.guard";
import { ImagesComponent } from "../components/images/images.component";

const routes: Routes=[
    {
        path: 'streams',
        component: StreamsComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'post/:id',
        component: CommentsComponent,
        canActivate: [AuthGuard], // Protect the comments route with AuthGuard
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StreamsRoutingModule { }
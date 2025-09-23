<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Post\CreatePostRequest;
use App\Services\Post\PostService;
use App\Models\Post;


class PostController extends Controller
{


    public function __construct(protected PostService $service) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $posts = $this->service->getAll();

        return view('posts.index', compact('posts'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('posts.form',['post' => new Post()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePostRequest $request)
    {

        $this->service->create($request->validated());

        return redirect()->route('posts.index')->with('message', 'Post creado.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $post = Post::findOrFail($id);
        return view('posts.form',['post' => $post]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);
        $this->service->update($post, $request->all());
        return redirect()->route('posts.index')->with('message', 'Post actualizado.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::findOrFail($id);
        $this->service->delete($post);
        return redirect()->route('posts.index')->with('message', 'Post eliminado.');
    }
}
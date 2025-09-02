import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Heart, 
  Send, 
  Users,
  Plus,
  Filter
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const Community = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  const categories = [
    { value: 'all', label: 'All Posts' },
    { value: 'general', label: 'General' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'mental_health', label: 'Mental Health' },
    { value: 'success_story', label: 'Success Stories' }
  ];

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, selectedCategory]);

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  };

  const fetchPosts = async () => {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch community posts.",
      });
    } else {
      setPosts(data || []);
      // Fetch comments for each post
      data?.forEach(post => fetchComments(post.id));
    }
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(prev => ({ ...prev, [postId]: data }));
    }
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.content || !user) return;

    const { error } = await supabase
      .from('community_posts')
      .insert([{
        user_id: user.id,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category
      }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post.",
      });
    } else {
      toast({
        title: "Success",
        description: "Post created successfully.",
      });
      setNewPost({ title: '', content: '', category: 'general' });
      setShowNewPost(false);
      fetchPosts();
    }
  };

  const addComment = async (postId: string) => {
    const content = newComment[postId];
    if (!content || !user) return;

    const { error } = await supabase
      .from('post_comments')
      .insert([{
        post_id: postId,
        user_id: user.id,
        content: content
      }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment.",
      });
    } else {
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      fitness: 'bg-green-100 text-green-800',
      nutrition: 'bg-orange-100 text-orange-800',
      mental_health: 'bg-purple-100 text-purple-800',
      success_story: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please sign in to access the community.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Community</h1>
          <p className="text-muted-foreground">Connect with others on their health journey</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => setShowNewPost(!showNewPost)} 
                  className="w-full"
                  variant={showNewPost ? "secondary" : "default"}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* New Post Form */}
            {showNewPost && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="post-title">Title</Label>
                    <Input
                      id="post-title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Enter post title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="post-category">Category</Label>
                    <select
                      id="post-category"
                      className="w-full p-2 border rounded-md"
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="post-content">Content</Label>
                    <Textarea
                      id="post-content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Share your thoughts..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createPost}>Create Post</Button>
                    <Button variant="outline" onClick={() => setShowNewPost(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No posts yet. Be the first to share something with the community!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {post.profiles?.full_name?.[0] || post.profiles?.email?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{post.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {post.profiles?.full_name || post.profiles?.email} • {new Date(post.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(post.category)}>
                          {post.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-foreground">{post.content}</p>
                      
                      <div className="flex items-center gap-4 pt-2 border-t">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes_count}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {comments[post.id]?.length || 0}
                        </Button>
                      </div>

                      {/* Comments */}
                      {comments[post.id] && comments[post.id].length > 0 && (
                        <div className="space-y-3 pt-2 border-t">
                          {comments[post.id].map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {comment.profiles?.full_name?.[0] || comment.profiles?.email?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted rounded-lg p-3">
                                  <p className="text-sm font-medium">
                                    {comment.profiles?.full_name || comment.profiles?.email}
                                  </p>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ 
                            ...prev, 
                            [post.id]: e.target.value 
                          }))}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addComment(post.id);
                            }
                          }}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => addComment(post.id)}
                          disabled={!newComment[post.id]?.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
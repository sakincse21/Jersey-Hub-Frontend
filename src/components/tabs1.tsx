import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Basic() {
  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
        <TabsTrigger value="discover">Discover</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="space-y-2 p-4">
        <h2 className="font-bold">Home</h2>
        <p>This is the home tab content.</p>
      </TabsContent>
      <TabsContent value="bookmarks" className="space-y-2 p-4">
        <h2 className="font-bold">Bookmarks</h2>
        <p>This is the bookmarks tab content.</p>
      </TabsContent>
      <TabsContent value="collections" className="space-y-2 p-4">
        <h2 className="font-bold">Collections</h2>
        <p>This is the collections tab content.</p>
      </TabsContent>
      <TabsContent value="discover" className="space-y-2 p-4">
        <h2 className="font-bold">Discover</h2>
        <p>This is the discover tab content.</p>
      </TabsContent>
    </Tabs>
  );
}

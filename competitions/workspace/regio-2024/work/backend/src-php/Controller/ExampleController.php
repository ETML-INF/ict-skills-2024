<?php

namespace Skills17\Controller;

use Skills17\Lib\Db\Database;
use Skills17\Lib\Http\Request;
use Skills17\Lib\Http\Response;
use Skills17\Lib\Uuid;

class ExampleController
{
    // set up the DB connection which is available at $this->db
    use Database;

    /**
     * Example route that can be deleted or adapted.
     * Contains usage examples and can be called via GET http://localhost:4000/api/example/blubb (defined in src-php/routes.php)
     *
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function example(Request $request, Response $response)
    {
        $stmt = $this->db->prepare('SELECT 1 as id, "example" as value WHERE "example_param" = :param');
        $stmt->bindValue(':param', 'example_param');
        $stmt->execute();
        $results = $stmt->fetchAll();

        return $response->send([
            'foo' => 'bar',
            'requestParam' => $request->getParam('var1'),
            'uuid' => Uuid::v4(),
            'results' => $results,
        ], 200);
    }
}

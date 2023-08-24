/* Function: CalculateAngleBetweenTwoLines
 * Description: Calculates the adjacent angle between two lines that intersect at a single point.
 *              The directing vectors will be calculated and the equations of the straight lines will be obtained from them.
 * Inputs: Three points are necessary.
 */

function calculateAngleBetweenTwoLines(point1, point2, point3) {
    var vectorD1 = new Array(2);
    var vectorD2 = new Array(2);
    let den, num;

    vectorD1[0] = point1.x - point2.x;
    vectorD1[1] = point1.y - point2.y;

    vectorD2[0] = point3.x - point1.x;
    vectorD2[1] = point3.y - point1.y;

    den = Math.abs(vectorD1[0] * vectorD2[0] + vectorD1[1] * vectorD2[1]);
    num = Math.sqrt(vectorD1[0] * vectorD1[0] + vectorD1[1] * vectorD1[1]) * Math.sqrt(vectorD2[0] * vectorD2[0] + vectorD2[1] * vectorD2[1]);
    
    return Math.acos(den / num) / (Math.PI / 180);
}


/* Function: calculateDistanceBetweenTwoPoints
 * Description: Calculates the distance between two points in a plane.
 * Inputs: Two points are necessary.
 */

function calculateDistanceBetweenTwoPoints(point1, point2) {
    return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
}
/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Fragment Phong Shader to be extended to a "Planet" shader.
 *
 * expects position and normal vectors in eye coordinates per vertex;
 * expects uniforms for ambient light, directional light, and phong material.
 * 
 *
 */

precision mediump float;

// position and normal in eye coordinates
varying vec4  ecPosition;
varying vec3  ecNormal;
varying vec2  texCoords;

// transformation matrices
uniform mat4  modelViewMatrix;
uniform mat4  projectionMatrix;

// Ambient Light
uniform vec3 ambientLight;

uniform bool debug;
uniform bool daylight;
uniform bool nightlight;
uniform bool clouds;
uniform bool redgreen;
uniform bool bathymetry;

// Material
struct PhongMaterial {
    vec3  ambient;
    vec3  diffuse;
    vec3  specular;
    float shininess;
};
uniform PhongMaterial material;

// texture
uniform sampler2D daylightTexture;
uniform sampler2D nightlightTexture;
uniform sampler2D bathymetryTexture;
uniform sampler2D cloudsTexture;
uniform sampler2D topographyTexture;


// Light Source Data for a directional light
struct LightSource {

    int  type;
    vec3 direction;
    vec3 color;
    bool on;

} ;
uniform LightSource light;

/*

 Calculate surface color based on Phong illumination model.
 - pos:  position of point on surface, in eye coordinates
 - n:    surface normal at pos
 - v:    direction pointing towards the viewer, in eye coordinates
 + assuming directional light

 */
vec3 phong(vec3 pos, vec3 n, vec3 v, LightSource light, PhongMaterial material) {

    // textures
    vec3 dayTexture = texture2D(daylightTexture, texCoords).rgb*1.5;
    vec3 nightTexture = texture2D(nightlightTexture, texCoords).rgb*1.5;
    vec3 bathyTexture = texture2D(bathymetryTexture, texCoords).rgb;
    vec3 topoTexture = texture2D(topographyTexture, texCoords).rgb;
    vec3 cloudsTexture = texture2D(cloudsTexture, texCoords).rgb;

    //debug
    float darkFactor = 1.0;
    if(debug){
        if(mod(texCoords.s, 0.05) > 0.025)
        darkFactor = 0.5;
    }


    float ndotv = dot(n,v);
        if(ndotv<0.0)
            return vec3(0,0,0);

    //redgreen map
    if (redgreen) {
        if (bathyTexture.x <= 0.2)
            return vec3(0, 1, 0);
        else
            return vec3(1, 0, 0);
    }


    //multiplier for smooth transitions
    vec3 l = normalize(light.direction);
    float ndotl = dot(n,-l);
    float clampedNdotL = clamp(ndotl, 0.0, 0.5);
    float multiplier = (0.0 - clampedNdotL + 0.5) * 2.0;


    //ambient -> nightside
    vec3 ambient;
    if(nightlight) {
        ambient = nightTexture * ambientLight * darkFactor * multiplier ;
     } else {
        ambient = material.ambient * ambientLight * darkFactor;
     }
    //clouds for the nightside
    if(clouds) {
        ambient = mix(ambient, -cloudsTexture * ambientLight * darkFactor * multiplier, cloudsTexture.x);
    }
    if(ndotl<=0.0)
        return ambient;


    //diffuse = dayside
    vec3 diffuse;
    if(daylight){
        diffuse = dayTexture * light.color * ndotl * darkFactor;
    } else {
        diffuse = material.diffuse * light.color * ndotl * darkFactor;
    }
    //clouds for dayside
    if(clouds) {
        diffuse = mix(diffuse, cloudsTexture * ndotl * 1.5 * darkFactor, cloudsTexture.x);
    }


    //specular part
    vec3 r = reflect(l,n);
    float rdotv = max( dot(r,v), 0.0);
    float specularModifier = 1.0;
    if (bathymetry) {
        if (bathyTexture.x <= 0.2)
            specularModifier = 0.2;
    }
    vec3 specular = specularModifier * material.specular * light.color * pow(rdotv, material.shininess);


    //shows green debug line
    if (debug) {
        if(ndotl >= 0.0 && ndotl <= 0.03) {
            return vec3(0,1,0);
        }
    }


    // return sum of all contributions
    return ambient + diffuse + specular;

}



void main() {

    // normalize normal after projection
    vec3 normalEC = normalize(ecNormal);

    // do we use a perspective or an orthogonal projection matrix?
    bool usePerspective = projectionMatrix[2][3] != 0.0;

    // for perspective mode, the viewing direction (in eye coords) points
    // from the vertex to the origin (0,0,0) --> use -ecPosition as direction.
    // for orthogonal mode, the viewing direction is simply (0,0,1)
    vec3 viewdirEC = usePerspective? normalize(-ecPosition.xyz) : vec3(0,0,1);

    // calculate color using phong illumination
    vec3 color = phong( ecPosition.xyz, normalEC, viewdirEC,
                        light, material );

    gl_FragColor = vec4(color, 1.0);


}
